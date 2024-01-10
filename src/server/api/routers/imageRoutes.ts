import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getImage: publicProcedure.query(({ ctx }) => ctx.db.image.findMany()),

  create: protectedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) =>
      ctx.db.image.create({
        data: {
          url: input.url,
          uploadedBy: { connect: { id: ctx.session.user.id } },
        },
      }),
    ),
  interactWithImage: protectedProcedure
    .input(z.object({ id: z.number(), like: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      console.log("test test");
      let imageInteraction = await ctx.db.imageInteraction.findFirst({
        where: { userId: ctx.session.user.id, imageId: input.id },
      });
      const image = await ctx.db.image.findFirst({
        where: { id: input.id },
      });
      if (!image)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image not found",
        });
      console.log(imageInteraction);
      if (!imageInteraction) {
        await ctx.db.imageInteraction.create({
          data: {
            imageId: input.id,
            userId: ctx.session.user.id,
            like: input.like,
          },
        });
        image[input.like ? "likes" : "dislikes"]++;
      } else {
        console.log("exists");
        console.log(imageInteraction.like, input.like);
        if (imageInteraction.like == input.like) {
          await ctx.db.imageInteraction.delete({
            where: {
              id: imageInteraction.id,
            },
          });
          image[input.like ? "likes" : "dislikes"]--;
        } else {
          await ctx.db.imageInteraction.update({
            where: {
              id: imageInteraction.id,
            },
            data: {
              like: input.like,
            },
          });
          console.log("hi");
          image[input.like ? "likes" : "dislikes"]++;
          image[!input.like ? "likes" : "dislikes"]--;
        }
      }
      await ctx.db.image.update({
        where: {
          id: input.id,
        },
        data: {
          likes: image.likes,
          dislikes: image.dislikes,
        },
      });
      return image;
    }),
  getLikedImages: protectedProcedure.query(({ ctx }) =>
    ctx.db.imageInteraction.findMany({
      where: { userId: ctx.session.user.id },
    }),
  ),
});
