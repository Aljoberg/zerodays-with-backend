import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Form from "./Form";
import { api } from "~/trpc/server";

export default async function Upload() {
  let session = await getServerAuthSession();
  if (!session) redirect("/api/auth/signin");
  let uploadImage = async (data: FormData) => {
    "use server";
    console.log("test");
    console.log(data.get("image"));
    if (!data.get("image")) return { status: "error", message: "no image" };
    api.image.create.mutate({
      url: data.get("image") as string,
    });
    redirect("/");
  };
  return <Form action={uploadImage} />;
}
