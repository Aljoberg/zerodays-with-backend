import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getImage: publicProcedure.query(({ ctx }) => {
    return ctx.db.image.findMany();
  }),

  create: protectedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.image.create({
        data: {
          url: input.url,
          uploadedBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  likeImage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.create({
        data: { userId: ctx.session.user.id, id: input.id },
      });
    }),
  dislikeImage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.create({
        where: { id: input.id },
        data: { dislikes: { increment: 1 } },
      });
    }),
});
