interface ImageObject {
  url: string;
  id: number;
  likes: number;
  dislikes: number;
  uploadedById: string;
}
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
