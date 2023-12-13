import Error from "./Error";
import DisplayImages from "./DisplayImages";
import { api } from "~/trpc/server";

export default async function ImagesPage() {
  /*let imageRequest = await fetch(
    "https://challenge.zerodays.dev/api/v1/photos",
    {cache: "no-store"}
  );*/
  let images = await api.image.getImage.query();
  //if (!imageRequest.ok) return <Error />;
  //let initialImages = await imageRequest.json();

  return <DisplayImages imagesToDisplay={images} />;
}
