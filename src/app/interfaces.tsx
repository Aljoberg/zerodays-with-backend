import { Comment, Image, User } from "@prisma/client";

interface ImageObject extends Image {
  user: User;
  comments: ImageComment[];
}

interface ImageComment extends Comment {
  postedBy: User;
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
export type { ImageObject, ImageObjectProps, FormProps, State, ImageComment };
