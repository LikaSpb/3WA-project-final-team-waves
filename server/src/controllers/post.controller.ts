import { Request, Response } from 'express'
import { PostService } from '../services/post.service'
import { CODERESPONSE } from '../constants/CodeResponse'

export class PostController {
  private postService = new PostService()

  public createPost = async (req: Request, res: Response) => {
    try {
      const { content, authorId } = req.body
      const newPost = await this.postService.savePost(content, authorId)
      res.status(CODERESPONSE.CREATED).json(newPost)
    } catch (error) {
      console.error('Error creating post:', error)
      res
        .status(CODERESPONSE.BAD_REQUEST)
        .json({ error: 'An error occurred while creating the post' })
    }
  }

  public editPost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId
      const { authorId, content } = req.body

      const updatedPost = await this.postService.editPost(
        postId,
        content,
        authorId,
      )
      res.status(CODERESPONSE.OK).json(updatedPost)
    } catch (error) {
      console.error('Error editing post:', error)
      res
        .status(CODERESPONSE.BAD_REQUEST)
        .json({ error: 'An error occurred while editing the post' })
    }
  }

  public deletePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId
      const authorId = req.body.authorId

      await this.postService.deletePost(postId, authorId)
      res.status(CODERESPONSE.OK).json({ message: 'Post deleted successfully' })
    } catch (e) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: e.message })
    }
  }

  public getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getAllPosts()
      res.status(CODERESPONSE.OK).json(posts)
    } catch (error) {
      console.error('Error getting posts:', error)
      res
        .status(CODERESPONSE.BAD_REQUEST)
        .json({ error: 'An error occurred while getting the posts' })
    }
  }
}
