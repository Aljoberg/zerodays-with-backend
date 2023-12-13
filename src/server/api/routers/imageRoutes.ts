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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.image.update({
        where: { id: input.id },
        data: { likes: { increment: 1 } },
      });
    }),
  dislikeImage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.image.update({
        where: { id: input.id },
        data: { dislikes: { increment: 1 } },
      });
    }),
});
