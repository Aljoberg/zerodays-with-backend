"use client";
import { Suspense } from "react";
import Loading from "./components/Loading";
import DisplayImages from "./components/DisplayImages";
import Navbar from "./components/Nav";
import { SessionProvider } from "next-auth/react";
import { api } from "~/trpc/react";
export default function Home() {
  /*let uploadImage = async (_: State | null, data: FormData): Promise<State> => {
    "use server";
    console.log("test");
    console.log(data.get("image"));
    if (!data.get("image")) return { status: "error", message: "no image" };
    await api.image.create.mutate({
      url: data.get("image") as string,
      title: data.get("title") as string,
    });
    return { status: "success" };
  };*/
  let imagesToDisplay = api.image.getImage.useQuery();
  let interactedImages = api.image.getLikedImages.useQuery();
  return (
    <SessionProvider>
      <Navbar refetch={imagesToDisplay.refetch} />
      <Suspense
        fallback={
          <div
            role="status"
            className="flex h-screen items-center justify-center"
          >
            <Loading />
          </div>
        }
      >
        <DisplayImages
          imagesToDisplay={imagesToDisplay}
          interactedImages={interactedImages}
          refetch={imagesToDisplay.refetch}
        />
      </Suspense>
    </SessionProvider>
  );
}
