import { Suspense } from "react";
import Loading from "./components/Loading";
import ImagesPage from "./components/ImagesPage";
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
      
      <ImagesPage />
    </Suspense>
  );
}
