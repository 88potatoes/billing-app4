import { google, calendar_v3, Auth } from "googleapis";
import * as cheerio from 'cheerio';
import { parseList } from "./parseList";

export async function getCalendarEvents(input: {
  oauth2Client: Auth.OAuth2Client;
  calendarId: string;
  timeMinUTC: string;
  timeMaxUTC: string;
}): Promise<calendar_v3.Schema$Events | undefined> {
  await input.oauth2Client.getAccessToken();

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

  const eventsWithDescriptions = allEvents.filter(event => {
    return !!event.description;
  });

  const regularEvents = eventsWithDescriptions.filter(event => {
    return !!event.start?.dateTime;
  });

  const descriptionAlteredEvents = regularEvents.map(event => {
    const $ = cheerio.load(event.description ?? '');
    let jsonOutput = undefined;
    try {
      jsonOutput = JSON.stringify(parseList($('ol').first(), $));
      return {
        ...event,
        description: jsonOutput,
      }
    } catch (e) {
      return event;
    }
  });

  return {
    ...response.data,
    items: descriptionAlteredEvents,
  };
}
