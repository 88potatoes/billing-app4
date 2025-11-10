import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users, oauthTokens } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { clerkClient } from "~/server/utils/clerk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 1. Verify user is authenticated
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await clerkClient.users.getUser(userId);
  const { code, state, error } = req.query;

  if (user.privateMetadata.googleCalendarOAuthState !== state) {
    return res.status(401).json({ error: "Something went wrong. Please try again." });
  }

  if (error) {
    return res.status(400).json({ error: "Something went wrong. Please try again." });
  }

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    // 3. Exchange code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token || !tokens.access_token) {
      throw new Error("No tokens received");
    }

    // 4. Get user record
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    // 5. Upsert OAuth token (update if exists, insert if new)
    const existingToken = await db.query.oauthTokens.findFirst({
      where: and(
        eq(oauthTokens.userId, dbUser.id),
        eq(oauthTokens.provider, "google"),
      ),
    });

    if (existingToken) {
      await db
        .update(oauthTokens)
        .set({
          refreshToken: tokens.refresh_token,
          accessToken: tokens.access_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope,
          updatedAt: new Date(),
        })
        .where(eq(oauthTokens.id, existingToken.id));
    } else {
      await db.insert(oauthTokens).values({
        userId: dbUser.id,
        provider: "google",
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope,
      });
    }

    // 6. Redirect to success page
    return res.redirect("/?success=google_connected");
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.redirect("/?error=oauth_failed");
  }
}
