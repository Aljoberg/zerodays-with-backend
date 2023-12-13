import { Suspense } from "react";
import Loading from "./Loading";
import ImagesPage from "./ImagesPage";
import { CreatePost } from "./_components/create-post";
export default async function Home() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="flex h-screen items-center justify-center"
        >
          <div className="h-9 w-9">
            <Loading />
          </div>
        </div>
      }
    >
      <CreatePost />
      <ImagesPage />
    </Suspense>
  );
}
