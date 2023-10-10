import { Router } from 'express'
import { PostController } from '../controllers/post.controller'
import {
  authMiddleware,
  validationMiddleware,
} from 'middlewares/validations.middleware'
import { PostDto } from 'dtos/posts.dto'

const router = Router()
const postController = new PostController()

router.post(
  '/',
  authMiddleware,
  validationMiddleware(PostDto),
  postController.createPost,
)
router.put(
  '/:postId',
  authMiddleware,
  validationMiddleware(PostDto),
  postController.editPost,
)
router.get('/', authMiddleware, postController.getAllPosts)
router.delete('/:postId', authMiddleware, postController.deletePost)

export default router
