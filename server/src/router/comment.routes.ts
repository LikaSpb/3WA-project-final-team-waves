import { Router } from 'express'
import {
  validationMiddleware,
  authMiddleware,
  RequestWithUser,
} from '../middlewares/validations.middleware'
import { CommentController } from '../controllers/comment.controller'
import { CommentDto, UpdateCommentDto } from 'dtos/comments.dto'

const router = Router()

const commentController = new CommentController()

router.post(
  '/:postId',
  authMiddleware,
  validationMiddleware(CommentDto),
  commentController.create,
)

router.put(
  '/:commentId',
  authMiddleware,
  validationMiddleware(UpdateCommentDto),
  commentController.editComment,
)

router.delete('/:commentId', authMiddleware, commentController.deleteComment)

export default router
