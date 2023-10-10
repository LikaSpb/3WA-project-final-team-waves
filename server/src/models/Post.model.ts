import mongoose, { Document, Schema, Types } from 'mongoose'

export interface Post extends Document {
  content: string
  authorId: Types.ObjectId | string
}

const postSchema = new Schema<Post>(
  {
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Post', postSchema)
