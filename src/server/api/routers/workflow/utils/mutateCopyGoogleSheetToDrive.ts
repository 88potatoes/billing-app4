import { google, drive_v3, sheets_v4, Auth } from "googleapis";

export async function mutateCopyGoogleSheetToDrive(
  oauth2Client: Auth.OAuth2Client,
  sourceSheetId: string,
  destinationFolderId: string,
  newFileName: string = "",
): Promise<drive_v3.Schema$File> {
  try {
    await oauth2Client.getAccessToken();

    console.log('yep')
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    console.log('yep1')
    let finalFileName: string = newFileName;
    if (!finalFileName) {
      const sheetMetadata: sheets_v4.Schema$Spreadsheet = (
        await sheets.spreadsheets.get({
          spreadsheetId: sourceSheetId,
          fields: "properties.title",
        })
      ).data;
      const originalTitle: string | null | undefined =
        sheetMetadata.properties?.title;
      finalFileName = originalTitle
        ? `Copy of ${originalTitle}`
        : "Copy of Untitled Sheet";
    }

    console.log('yep2')
    const requestBody: drive_v3.Schema$File = {
      name: finalFileName,
      parents: [destinationFolderId],
    };

    console.log('yep3')
    const response: { data: drive_v3.Schema$File } = await drive.files.copy({
      fileId: sourceSheetId,
      requestBody: requestBody,
      fields: "id, name, webViewLink",
    });

    console.log(
      `Successfully copied sheet "${sourceSheetId}" to folder "${destinationFolderId}"`,
    );
    console.log(`New file ID: ${response.data.id}`);
    console.log(`New file Name: ${response.data.name}`);
    console.log(`View Link: ${response.data.webViewLink}`);

    return response.data; // Return metadata of the new copied file
  } catch (error: any) {
    // Use 'any' for caught error to allow flexible error checking
    console.error("Error copying Google Sheet:", error.message);
    if (error.code === 403) {
      console.error("Permission denied. Ensure the authenticated user has:");
      console.error(
        "  - Editor access to the destination Google Drive folder.",
      );
      console.error("  - Viewer access to the source Google Sheet.");
      console.error(
        "  - The correct OAuth scopes were granted by the user (e.g., drive.file or drive).",
      );
    } else if (error.code === 404) {
      console.error(
        "File or folder not found. Check if the Sheet ID or Folder ID is correct.",
      );
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      console.error("Google API Error Details:", error.response.data.error);
    }
    throw error; // Re-throw the error for external handling
  }
}

