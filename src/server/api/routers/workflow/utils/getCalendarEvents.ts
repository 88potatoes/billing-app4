import { google, calendar_v3, Auth } from "googleapis";
import * as cheerio from "cheerio";
import { parseList } from "./parseList";
import { normalizeItemData } from "./normalizeItemData";
import { parseBillingFormat } from "./parseBillingFormat";

export async function getCalendarEvents(input: {
  oauth2Client: Auth.OAuth2Client;
  calendarId: string;
  timeMinUTC: string;
  timeMaxUTC: string;
}): Promise<calendar_v3.Schema$Events | undefined> {
  const calendar = google.calendar({ version: "v3", auth: input.oauth2Client });

  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: input.calendarId,
    timeMin: input.timeMinUTC,
    timeMax: input.timeMaxUTC,
    singleEvents: true,
    orderBy: "startTime",
  };

  const response = await calendar.events.list(params);
  const allEvents = response.data.items || [];

  const events = allEvents
    .filter((event) => {
      return !!event.description && !!event.start?.dateTime;
    })
    .map((event) => {
      console.log('===event', event);

      const description = event.description ?? "";

      // Check if this is the billing format
      if (description.includes("START BILLING")) {
        try {
          const billingData = parseBillingFormat(description);

          if (!billingData) {
            return false;
          }

          return {
            ...event,
            description: JSON.stringify(billingData),
          };
        } catch (e) {
          console.error("Error parsing billing format:", e);
          return false;
        }
      }

      // Otherwise, use the original simple format parser
      const $ = cheerio.load(description);
      const olElement = $("ol").first();

      // Check if <ol> actually exists
      if (olElement.length === 0) {
        return false; // No HTML list found
      }

      try {
        const jsonOutput = parseList(olElement, $);

        // Check if parsing produced valid output
        if (!jsonOutput || jsonOutput === null) {
          return false;
        }

        console.log(jsonOutput);

        return {
          ...event,
          description: JSON.stringify(normalizeItemData(jsonOutput)),
        };
      } catch (e) {
        return false;
      }
    }).filter(Boolean) as calendar_v3.Schema$Events["items"];

  return {
    ...response.data,
    items: events,
  };
}
