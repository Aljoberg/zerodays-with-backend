import { Image as ImageObject, ImageInteraction } from "@prisma/client";

interface ImageObjectProps {
  image: ImageObject;
  onVote: Function;
  id: number;
}

interface FormProps {
  action: (data: FormData) => void;
}
interface State {
  status: string;
  message?: string;
}
export type { ImageObject, ImageObjectProps, FormProps, State };
