import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IComment {
  postId: Types.ObjectId
  authorId: Types.ObjectId
  content: string
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Comment', commentSchema)
