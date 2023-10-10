import CommentModel from '../models/Comments.model'
import { io } from '../server'

export class CommentService {
  public async create(postId: string, userId: string, content: string) {
    const newComment = await CommentModel.create({
      postId,
      authorId: userId,
      content,
    })

    const populatedComment = await CommentModel.findById(newComment._id)
      .select('_id content authorId createdAt')
      .populate({
        path: 'authorId',
        select: 'firstname lastname profilePicture',
      })

    io.emit('comment:receive:' + postId, { content: populatedComment, postId })

    return newComment
  }

  public editComment = async (
    commentId: string,
    content: string,
    authorId: string,
  ) => {
    try {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: commentId, authorId },
        { content },
        { new: true },
      ).populate({
        path: 'authorId',
        select: '_id firstname lastname profilePicture',
      })

      if (!comment) {
        throw new Error('Comment not found or not authorized')
      }

      io.emit('comment:edited:' + comment.postId, comment)

      return comment
    } catch (error) {
      throw error
    }
  }

  public deleteComment = async (commentId: string, authorId: string) => {
    try {
      const comment = await CommentModel.findOneAndDelete({
        _id: commentId,
        authorId,
      })
      if (!comment) {
        throw new Error('Comment not found or not authorized')
      }
      io.emit('comment:deleted:' + comment.postId, comment._id)

      return comment
    } catch (error) {
      throw error
    }
  }
}
