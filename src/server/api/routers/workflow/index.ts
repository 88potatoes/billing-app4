import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { clerkClient } from "~/server/utils/clerk";

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
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    // const events = await ctx.db.query.events.findMany({
    //   orderBy: [
    //     {
    //       createdAt: "desc",
    //     },
    //   ],
    // });

    return [];
  }),
});
