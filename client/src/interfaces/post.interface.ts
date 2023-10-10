import { IComment } from "./comment.interface";
import { IUser } from "./user.interface";

export interface IPost {
  filter: any;
  _id: string;
  content: string;
  authorId: IUser;
  comments: IComment[];
  createdAt: Date;
}
