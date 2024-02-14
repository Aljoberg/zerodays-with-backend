import { Comment } from "@prisma/client";
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
  refetch
}: {
  imageId: number;
  comments: ImageComment[];
  refetch: (ReturnType<typeof useQuery>)["refetch"]
}) {
  let [open, setOpen] = useState(false);
  let commentMutation = api.image.createComment.useMutation();
  useEffect(() => {
    if (commentMutation.isError) setOpen(true);
    else if (commentMutation.isSuccess) {
      setOpen(false);
      refetch();
    }
    if (commentMutation.isError)
      alert(`Error: ${JSON.stringify(commentMutation.error)}`); // TODO: spremeni v shadcdn Alert alpa kaj podobnega
  }, [commentMutation.status]);
  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="mb-2 font-bold">Komentarji: </p>
      {comments.map((comment) => (
        <div className="m-2 bg-gray-800 rounded-xl p-2 flex flex-col items-center justify-center relative w-full">
          <div className="flex items-center">
            <Image
              alt="user pfp"
              src={
                comment.postedBy.image ??
                `https://api.dicebear.com/7.x/adventurer/png?seed=${comment.postedBy.name ?? Math.random()}`
              }
              className="rounded-full mr-2"
              width={50}
              height={50}
            />
            <span className="font-bold">{comment.postedBy.name}</span>
          </div>
          <span className="mt-2">{comment.content}</span>
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
            <DialogTitle>Uploadaj sliko</DialogTitle>
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
