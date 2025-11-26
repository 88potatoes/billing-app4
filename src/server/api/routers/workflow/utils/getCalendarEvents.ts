import { google, calendar_v3, Auth } from "googleapis";

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

  const regularEvents = allEvents.filter(event => {
    return !!event.start?.dateTime;
  });

  return {
    ...response.data,
    items: regularEvents,
  };
}
