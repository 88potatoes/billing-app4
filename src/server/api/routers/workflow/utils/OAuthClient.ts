import { google } from "googleapis";
import { type User } from "~/server/db/schema";

export const getOauthClient = async ({ user }: { user: User }) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  oauth2Client.setCredentials({
    refresh_token: user.refreshToken
  });
  return oauth2Client;
};
