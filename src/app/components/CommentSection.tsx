import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { ImageComment } from "../interfaces";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
export default function CommentSection({
  imageId,
  comments,
  refetch,
}: {
  imageId: number;
  comments: ImageComment[];
  refetch: ReturnType<typeof useQuery>["refetch"];
}) {
  let [open, setOpen] = useState(false);
  console.log("COMENTS");
  console.log(comments.map((i) => `${i.content}: ${i.parentId}`));
  let [openAndReplyId, setOpenAndReplyId] = useState<string | null>(null);
  let commentMutation = api.image.createComment.useMutation();
  useEffect(() => {
    if (openAndReplyId == null) {
      // setOpen
      if (commentMutation.isError) setOpen(true);
      else if (commentMutation.isSuccess) {
        setOpen(false);
        refetch();
      }
      if (commentMutation.isError)
        alert(`Error: ${JSON.stringify(commentMutation.error)}`); // TODO: spremeni v shadcdn Alert alpa kaj podobnega
    } else {
      // setOpenAndReplyId
      if (commentMutation.isError) setOpenAndReplyId(openAndReplyId);
      else if (commentMutation.isSuccess) {
        setOpenAndReplyId(null);
        refetch();
      }
      if (commentMutation.isError)
        alert(`Error: ${JSON.stringify(commentMutation.error)}`); // TODO: spremeni v shadcdn Alert alpa kaj podobnega
    }
  }, [commentMutation.status]);

  let recursivelyLoadReplies = (comment: ImageComment, depth: number) => {
    let finalComments: [ImageComment, number][] = [];
    console.log(comments, comment);
    // if (!firstTime) finalComments.push(comment);
    finalComments.push([comment, depth]);
    console.log(comment, depth);
    comments
      .filter((i) => i.parentId == comment.id)
      .forEach((comment) =>
        finalComments.push(
          ...recursivelyLoadReplies(comment, depth + 50).finalComments,
        ),
      );
    console.log(finalComments, "finalComments");
    return {
      finalComments,
      depth: depth + 1,
      elements: finalComments.map(([replyComment, depth]) => (
        <div style={{ paddingLeft: `${depth}px` }}>
          <div className="mb-4 flex">
            {depth == 0 || (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width={75}
              height={75}
              version="1"
              viewBox="0 0 1280 1280"
              className="rotate-90"
            >
              <path
                d="M9980 9277c-80-27-133-62-260-174-77-67-100-94-100-113 0-224-43-2081-50-2205-19-304-50-435-120-505-44-44-147-104-206-119-163-43-668-52-2814-51-1813 1-2440 6-2456 22-14 15 131 179 438 496 120 123 240 254 268 290 63 84 90 166 90 271-1 244-130 424-354 490-66 20-94 22-194 19-132-4-145-9-257-93-116-87-324-286-890-856-655-659-797-818-875-975-69-141-64-279 14-388 208-290 1341-1464 1671-1730 95-76 177-120 266-141 180-42 351 6 468 130 98 105 131 197 131 367 0 189-17 216-396 613-141 149-288 306-325 350-59 69-66 81-50 86 20 8 735 25 1376 34 231 3 1266 10 2299 16l1879 10 151 81c187 99 285 164 403 267 235 205 441 511 492 732 44 187 57 492 67 1559 12 1240-8 1352-261 1476-140 68-283 83-405 41z"
                transform="matrix(.1 0 0 -.1 0 1280)"
              ></path>
            </svg>
            )}
            <div className="flex flex-col items-center justify-center">
              <div key={replyComment.id} className="flex items-center">
                <Image
                  alt="user pfp"
                  src={
                    replyComment.postedBy.image ??
                    `https://api.dicebear.com/7.x/adventurer/png?seed=${replyComment.postedBy.name ?? Math.random()}`
                  }
                  className="mr-2 rounded-full"
                  width={50}
                  height={50}
                />
                <span className="font-bold">{replyComment.postedBy.name}</span>
              </div>
              <span className="mt-2">{replyComment.content}</span>
            </div>
          </div>
          <Dialog
            open={!!openAndReplyId}
            onOpenChange={(open) => setOpenAndReplyId(open ? replyComment.id : null)}
          >
            <DialogTrigger
              onClick={() => setOpenAndReplyId(replyComment.id)}
              asChild
            >
              <Button className="bg-slate-700 text-gray-300 hover:bg-slate-500">
                Odgovori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Odgovor</DialogTitle>
              </DialogHeader>
              <form
                className="grid gap-4 py-4"
                action={(data) => {
                  let content = data.get("content") as string;
                  let replyId = openAndReplyId as string;
                  console.log(replyId, "replyId");
                  commentMutation.mutate({ content, imageId, replyId });
                }}
              >
                <Form />
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )),
    };
  };
  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="mb-2 font-bold">Komentarji: </p>
      {comments
        .filter((i) => !i.parentId)
        .map((comment) => (
          <div
            key={comment.id}
            className="relative m-2 flex w-full flex-col items-center justify-center rounded-xl bg-gray-800 p-2"
          >
            {recursivelyLoadReplies(comment, 0).elements}
          </div>
        ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(true)} asChild>
          <Button className="bg-slate-700 text-gray-300 hover:bg-slate-500">
            Postaj comment
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Postaj comment</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 py-4"
            action={(data) => {
              let content = data.get("content") as string;
              commentMutation.mutate({ content, imageId });
            }}
          >
            <Form />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Form() {
  let { pending } = useFormStatus();
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="content" className="text-right">
          Content
        </Label>
        <Input name="content" id="content" className="col-span-3" />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Loading..." : "Post comment"}
        </Button>
      </DialogFooter>
    </>
  );
}
