"use client";
import { useState } from "react";
import Image from "next/image";
import { DisplayImagesProps, ImageObject } from "../interfaces";
import Loading from "./Loading";
import { api } from "~/trpc/react";

export default function DisplayImages({ imagesToDisplay }: DisplayImagesProps) {
  const likeMutation = api.image.interactWithImage.useMutation({
    onSuccess: (data) => {
      updateImages(data);
    },
  });
  let [images, setImages] = useState(imagesToDisplay);
  //let [loading, setLoading] = useState<[boolean, boolean?, number?]>([false]);
  let [error, setError] = useState([true, false]);
  let updateImages = (updatedImage: ImageObject) => {
    let updatedImages = images.map((image: ImageObject) =>
      image.id == updatedImage.id ? updatedImage : image,
    );
    setImages(updatedImages);
  };

  const vote = async (like: boolean, id: number) => {
    console.log("test test");
    //setError([like, false]);
    likeMutation.mutate({ id, like });
    //if (likeMutation.error) setError([like, true]);
    
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {images.map((image: ImageObject) => {
        console.log(image.url);
        let totalVotes = image.likes + image.dislikes;
        let likePercentage = totalVotes == 0 ? null : (image.likes / totalVotes) * 100;
        console.log(likePercentage);
        return (
          <div key={image.id}>
            <div className="inset-0 overflow-hidden rounded-lg shadow-lg">
              <Image src={image.url} height={300} width={500} alt="Image" />
            </div>
            <div
              className={`mt-2 flex items-center ${
                likeMutation.isLoading ? "justify-center" : "justify-between"
              }`}
            >
              {likeMutation.isLoading ? (
                <div className="h-6 w-6 m-2">
                  <Loading />
                </div>
              ) : (
                <>
                  <span
                    onClick={() => vote(true, image.id)}
                    className="cursor-pointer select-none rounded p-2 text-green-500 duration-200 hover:bg-gray-700"
                  >
                    {error[0] && error[1] ? (
                      <p className="text-red-500">⚠️ Error</p>
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
                    ) : (
                      `👎 ${image.dislikes}`
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
                style={{ width: `${likePercentage ? 100 - likePercentage : 0}%` }}
                className="h-full rounded-br-full rounded-tr-full bg-red-500"
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
