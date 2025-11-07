const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "openid",
  "profile",
  "email",
];
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const getGoogleCalendarOAuthUrl = async ({ state }: { state: string }) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    throw new Error("Missing Google OAuth credentials");
  }

  const authorizationUrl = new URL(GOOGLE_AUTH_URL);
  authorizationUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  authorizationUrl.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI);
  authorizationUrl.searchParams.append("scope", SCOPES.join(" "));
  authorizationUrl.searchParams.append("response_type", "code");
  authorizationUrl.searchParams.append("access_type", "offline");
  authorizationUrl.searchParams.append("prompt", "consent");
  authorizationUrl.searchParams.append("state", state);

  return authorizationUrl.toString();
};
