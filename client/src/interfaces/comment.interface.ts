import { IUser } from "./user.interface";

export interface IComment {
  postId: string;
  authorId: IUser;
  content: string;
  createdAt: string;
  profilPicture: string;
  _id: string;
}
