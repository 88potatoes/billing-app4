import { z } from "zod";
import YAML from 'yaml'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { oauthTokens, posts, users } from "~/server/db/schema";
import { clerkClient } from "~/server/utils/clerk";
import { getCalendarEvents } from "./utils/getCalendarEvents";
import { getOauthClient } from "./utils/OAuthClient";
import { eq } from "drizzle-orm";

type InvoiceType = {
  Cost: string;
  Amount: number;
  Rate: number;
}

export const workflowRouter = createTRPCRouter({
  run: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const clerkUser = await clerkClient.users.getUser(ctx.userId);

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
  getEvents: protectedProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.clerkId, ctx.userId),
    });
    if (!user) {
      throw new Error("User not found");
    }

    const refreshToken = await ctx.db.query.oauthTokens.findFirst({
      where: eq(oauthTokens.userId, user.id),
    });
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const oAuthClient = await getOauthClient({
      refreshToken: refreshToken.refreshToken,
    });

    const events = await getCalendarEvents({
      oauth2Client: oAuthClient,
      calendarId: "primary",
      timeMinUTC: input.startDate.toISOString(),
      timeMaxUTC: input.endDate.toISOString(),
    });

    // events?.items?.reduce((acc, event) => {
    //   console.log(event.description)
    //   const a = YAML.parse(event.description ?? '')       
    //   console.log(a)
    //   return [...acc];
    // }, []);

    return events;
  }),
});
