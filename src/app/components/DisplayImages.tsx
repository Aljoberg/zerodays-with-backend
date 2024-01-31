"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageObject } from "../interfaces";
import Loading from "./Loading";
import { api } from "~/trpc/react";
import { ImageInteraction } from "@prisma/client";
import LikeButton from "./Like";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DisplayImages({
  imagesToDisplay,
  interactedImages,
}: {
  imagesToDisplay: ReturnType<typeof useQuery>;
  interactedImages: ReturnType<typeof useQuery>;
}) {
  let images = imagesToDisplay.data as ImageObject[];
  let likedImages = interactedImages.data as ImageInteraction[];

  console.log(images);

  console.log("likedornotimages");
  if (!images)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {images.map((image: ImageObject) => (
        <OneImage
          key={image.id}
          initialImage={image}
          imageInteraction={
            likedImages?.find((i) => i.imageId == image.id) ?? null
          }
        />
      ))}
    </div>
  );
}

function OneImage({
  initialImage,
  imageInteraction,
}: {
  initialImage: ImageObject;
  imageInteraction: ImageInteraction | null;
}) {
  let [error, setError] = useState([true, false]);
  let [like, setLike] = useState<boolean | null>(
    imageInteraction?.like || null,
  );
  let { data: session } = useSession();
  let [image, setImage] = useState(initialImage);
  console.log(image.url);
  let totalVotes = image.likes + image.dislikes;
  let likePercentage =
    totalVotes == 0 ? null : (image.likes / totalVotes) * 100;
  let dislikePercentage =
    totalVotes == 0 ? null : (image.dislikes / totalVotes) * 100;
  console.log(likePercentage, dislikePercentage);
  const vote = async (like: boolean, id: number) => {
    console.log("test test");
    setError([like, false]);
    likeMutation.mutate({ id, like });
    if (likeMutation.error) setError([like, true]);
  };
  const likeMutation = api.image.interactWithImage.useMutation({
    onSuccess: (data) => {
      // @ts-ignore
      session?.user && setImage({ ...data.image, user: session.user });
      setLike(data.finalLike);
    },
  });
  return (
    <div key={image.id}>
      <p className="mb-4 text-center text-xl font-bold">{image.title}</p>
      <div className="mb-4 flex items-center justify-center">
        <Image
          className="rounded-full mr-4"
          alt="User image"
          width={50}
          height={50}
          src={
            image.user.image ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${
              image.user.name ?? Math.random()
            }`
          }
        />
        <p className="text-center">{image.user.name}</p>
      </div>
      <div className="inset-0 overflow-hidden rounded-lg shadow-lg">
        <Image src={image.url} height={300} width={500} alt="Image" />
      </div>
      <div
        className={`mt-2 flex items-center ${
          likeMutation.isLoading ? "justify-center" : "justify-between"
        }`}
      >
        {likeMutation.isLoading ? (
          <div className="m-2 h-6 w-6">
            <Loading />
          </div>
        ) : (
          <>
            <span
              onClick={() => vote(true, image.id)}
              className="cursor-pointer select-none rounded p-2 text-green-500 duration-200 *:text-center hover:bg-gray-700"
            >
              {error[0] && error[1] ? (
                <p className="text-red-500">⚠️ Error</p>
              ) : (
                <>
                  <LikeButton color={like == true ? "green" : "white"} />
                  <p>{image.likes}</p>
                </>
              )}
            </span>
            <span
              onClick={() => vote(false, image.id)}
              className="cursor-pointer select-none rounded p-2 text-red-500 duration-200 *:text-center hover:bg-gray-700"
            >
              {!error[0] && error[1] ? (
                <p className="text-red-500">⚠️ Error</p>
              ) : (
                <>
                  <LikeButton dislike color={like == false ? "red" : "white"} />
                  <p>{image.dislikes}</p>
                </>
              )}
            </span>
          </>
        )}
      </div>
      <div className="mt-2 flex h-2 rounded-full bg-gray-300">
        <div
          style={{ width: `${likePercentage ?? 0}%` }}
          className="h-full rounded-bl-full rounded-tl-full bg-green-500"
        ></div>
        <div
          style={{ width: `${dislikePercentage ?? 0}%` }}
          className="h-full rounded-br-full rounded-tr-full bg-red-500"
        ></div>
      </div>
    </div>
  );
}
