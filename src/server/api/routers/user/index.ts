import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getGoogleCalendarOAuthUrl } from "../workflow/utils/getGoogleCalendarOAuthUrl";
import { clerkClient } from "~/server/utils/clerk";

export const userRouter = createTRPCRouter({
   authWithGoogleCalendar: protectedProcedure.mutation(async ({ ctx }) => {
    console.log('hi');
    const state = Math.random().toString(36).substring(2);
    await clerkClient.users.updateUserMetadata(ctx.userId, {
      privateMetadata: {
        googleCalendarOAuthState: state,
      },
    });
    const url = await getGoogleCalendarOAuthUrl({ state });
    return { url };
  }),
});
