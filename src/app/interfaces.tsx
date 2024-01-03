import { Image as ImageObject } from "@prisma/client";

interface ImageObjectProps {
  image: ImageObject;
  onVote: Function;
  id: number;
}
interface DisplayImagesProps {
  imagesToDisplay: ImageObject[];
}

interface FormProps {
  action: (data: FormData) => void;
}

export type { ImageObject, ImageObjectProps, DisplayImagesProps, FormProps };
