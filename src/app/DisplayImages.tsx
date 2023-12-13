"use client";
import { useState } from "react";
import Image from "next/image";
import { DisplayImagesProps, ImageObject } from "./interfaces";
import Loading from "./Loading";
import { api } from "~/trpc/react";
export default function DisplayImages({ imagesToDisplay }: DisplayImagesProps) {

  const likeMutation = api.image.likeImage.useMutation();
  const dislikeMutation = api.image.dislikeImage.useMutation();
  let [images, setImages] = useState(imagesToDisplay);
  let [loading, setLoading] = useState<[boolean, boolean?, number?]>([false]);
  let [error, setError] = useState([true, false]);
  let updateImages = (updatedImage: ImageObject) => {
    let updatedImages = images.map((image: ImageObject) =>
      image.id == updatedImage.id ? updatedImage : image,
    );
    setImages(updatedImages);
  };

  const vote = async (like: boolean, id: number) => {
    setLoading([like, true, id]);
    setError([like, false]);

    /*let resp = await fetch(
      `https://challenge.zerodays.dev/api/v1/photos/${id}/${
        like ? "like" : "dislike"
      }`,
      {
        method: "PATCH",
      },
    );
    if (!resp.ok) setError([like, true]);*/
    let mutation = like ? likeMutation : dislikeMutation;
    if (mutation.error) setError([like, true]);
    mutation.mutate({ id });
    if (mutation.data) updateImages(mutation.data);
    setLoading([like, false, id]);
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {images.map((image: ImageObject) => {
        console.log(image.url);
        let totalVotes = image.likes + image.dislikes;
        let likePercentage = (image.likes / totalVotes) * 100;

        return (
          <div key={image.id}>
            <div className="inset-0 overflow-hidden rounded-lg shadow-lg">
              <Image src={image.url} height={300} width={500} alt="Image" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span
                onClick={() => vote(true, image.id)}
                className="cursor-pointer select-none rounded p-2 text-green-500 duration-200 hover:bg-gray-700"
              >
                {error[0] && error[1] ? (
                  <p className="text-red-500">⚠️ Error</p>
                ) : loading[1] && loading[0] && loading[2] == image.id ? (
                  <div className="h-6 w-6">
                    <Loading />
                  </div>
                ) : (
                  `👍 ${image.likes}`
                )}
              </span>
              <span
                onClick={() => vote(false, image.id)}
                className="cursor-pointer select-none rounded p-2 text-red-500 duration-200 hover:bg-gray-700"
              >
                {!error[0] && error[1] ? (
                  <p className="text-red-500">⚠️ Error</p>
                ) : loading[1] && !loading[0] && loading[2] == image.id ? (
                  <div className="h-6 w-6">
                    <Loading />
                  </div>
                ) : (
                  `👎 ${image.dislikes}`
                )}
              </span>
            </div>
            <div className="mt-2 flex h-2 rounded-full bg-gray-300">
              <div
                style={{ width: `${likePercentage}%` }}
                className="h-full rounded-bl-full rounded-tl-full bg-green-500"
              ></div>
              <div
                style={{ width: `${100 - likePercentage}%` }}
                className="h-full rounded-br-full rounded-tr-full bg-red-500"
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
