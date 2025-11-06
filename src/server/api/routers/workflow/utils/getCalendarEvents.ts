import { google, calendar_v3, Auth } from "googleapis";

export async function getCalendarEvents(
  oauth2Client: Auth.OAuth2Client,
  calendarId: string,
  timeMinUTC: string,
  timeMaxUTC: string,
): Promise<calendar_v3.Schema$Events | undefined> {
  await oauth2Client.getAccessToken();

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId,
    timeMin: timeMinUTC,
    timeMax: timeMaxUTC,
    singleEvents: true,
    orderBy: "startTime",
  };

  const response = await calendar.events.list(params);

  console.log(`Successfully read events from calendar "${calendarId}".`);
  console.log(`Found ${response.data.items?.length || 0} events.`);

  return response.data;
}
