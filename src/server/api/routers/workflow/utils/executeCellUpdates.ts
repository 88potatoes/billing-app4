import { google, sheets_v4, Auth } from "googleapis";

export type CellUpdate = {
  cell: string;
  value: any;
};

export async function executeCellUpdates(
  auth: Auth.OAuth2Client,
  spreadsheetId: string,
  updates: CellUpdate[],
): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  const data: sheets_v4.Schema$ValueRange[] = updates.map((update) => ({
    range: update.cell,
    values: [[update.value]],
  }));

  const requestBody: sheets_v4.Schema$BatchUpdateValuesRequest = {
    valueInputOption: "USER_ENTERED",
    data,
  };

  try {
    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody,
    });
    console.log(`${result.data.totalUpdatedCells} individual cells updated.`);
  } catch (err) {
    const error = err as Error;
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
}
