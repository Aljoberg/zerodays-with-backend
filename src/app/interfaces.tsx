import { Image, User } from "@prisma/client";

interface ImageObject extends Image {
  user: User;
}

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
