import { Image as ImageObject, ImageInteraction } from "@prisma/client";

interface ImageObjectProps {
  image: ImageObject;
  onVote: Function;
  id: number;
}
interface DisplayImagesProps {
  imagesToDisplay: ImageObject[];
  interactedImages: ImageInteraction[];
}

interface FormProps {
  action: (data: FormData) => void;
}


export type { ImageObject, ImageObjectProps, DisplayImagesProps, FormProps };
