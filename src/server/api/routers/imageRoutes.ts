import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getImage: publicProcedure.query(async ({ ctx }) => {
    let images = await ctx.db.image.findMany();
    let users = await ctx.db.user.findMany();
    let comments = await ctx.db.comment.findMany({
      where: {
        imageId: {
          in: images.map((i) => i.id),
        },
      },
    });
    let mappedComments = comments.map((i) => ({
      ...i,
      postedBy: users.find((ii) => ii.id == i.userId),
    }));
    return images.map((i) => ({
      ...i,
      user: users.find((ii) => ii.id == i.uploadedById),
      comments: mappedComments.filter((ii) => ii.imageId == i.id),
    }));
  }),
  create: protectedProcedure
    .input(z.object({ url: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) =>
      ctx.db.image.create({
        data: {
          url: input.url,
          title: input.title,
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
      let finalLike = null;
      console.log(imageInteraction);
      if (!imageInteraction) {
        await ctx.db.imageInteraction.create({
          data: {
            imageId: input.id,
            userId: ctx.session.user.id,
            like: input.like,
          },
        });
        finalLike = input.like;
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
          finalLike = null;
          console.log(imageInteraction);
          console.log("deletes");
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
          finalLike = input.like;
          console.log(imageInteraction);
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
      console.log("final like");
      console.log(finalLike);
      return { image, finalLike };
    }),
  getLikedImages: protectedProcedure.query(({ ctx }) =>
    ctx.db.imageInteraction.findMany({
      where: { userId: ctx.session.user.id },
    }),
  ),
  createComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        imageId: z.number(),
        replyId: z.optional(z.string()),
      }),
    )
    .mutation(({ ctx, input }) =>
      input.replyId
        ? ctx.db.comment.create({
            data: {
              parentId: input.replyId,
              content: input.content,
              imageId: input.imageId,
              userId: ctx.session.user.id,
            },
          })
        : ctx.db.comment.create({
            data: {
              content: input.content,
              imageId: input.imageId,
              userId: ctx.session.user.id,
            },
          }),
    ),
});
