import { io } from 'server'
import { CODERESPONSE } from '../constants/CodeResponse'
import { CommentService } from '../services/comment.service'
import { Request, Response } from 'express'

export class CommentController {
  private commentService = new CommentService()

  public create = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params
      const { authorId, content } = req.body

      const newComment = await this.commentService.create(
        postId,
        authorId,
        content,
      )

      res.status(CODERESPONSE.CREATED).json(newComment)
    } catch (e) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: e.message })
    }
  }

  public editComment = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId
      const { content, authorId } = req.body

      const updatedComment = await this.commentService.editComment(
        commentId,
        content,
        authorId,
      )

      io.emit(`comment:edited:${commentId}`, updatedComment)
      res.status(CODERESPONSE.OK).json(updatedComment)
    } catch (e) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: e.message })
    }
  }

  public deleteComment = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId
      const authorId = req.body.authorId

      await this.commentService.deleteComment(commentId, authorId)
      res
        .status(CODERESPONSE.OK)
        .json({ message: 'Comment deleted successfully' })
    } catch (e) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: e.message })
    }
  }
}
