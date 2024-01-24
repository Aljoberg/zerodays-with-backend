import { Suspense } from "react";
import Loading from "./components/Loading";
import DisplayImages from "./components/DisplayImages";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Navbar from "./components/Nav";
import { State } from "./interfaces";
export default async function Home() {
  let session = await getServerAuthSession();
  let uploadImage = async (_: State | null, data: FormData): Promise<State> => {
    "use server";
    console.log("test");
    console.log(data.get("image"));
    if (!data.get("image")) return { status: "error", message: "no image" };
    await api.image.create.mutate({
      url: data.get("image") as string,
    });
    return { status: "success" };
  };
  return (
    <>
      <Navbar action={uploadImage} session={session} />
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
        <DisplayImages />
      </Suspense>
    </>
  );
}
