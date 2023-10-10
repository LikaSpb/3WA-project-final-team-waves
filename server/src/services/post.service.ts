import mongoose, { HydratedDocument } from 'mongoose'
import PostModel from '../models/Post.model'
import CommentModel, { IComment } from '../models/Comments.model'
import { io } from 'server'

export class PostService {
  public savePost = async (content: string, authorId: string) => {
    try {
      const newPost = await PostModel.create({
        content,
        authorId,
      })

      const populatedPost = await PostModel.findById(newPost._id)
        .select('_id content createdAt authorId')
        .populate({
          path: 'authorId',
          select: 'firstname lastname profilePicture',
        })

      const returnedResponse: Record<'comments', []> = {
        ...populatedPost.toObject(),
        comments: [],
      }

      io.emit('post:receive', returnedResponse)

      return returnedResponse
    } catch (error) {
      throw error
    }
  }

  public editPost = async (
    postId: string,
    content: string,
    authorId: string,
  ) => {
    try {
      const post = await PostModel.findOneAndUpdate(
        { _id: postId },
        { content },
        { new: true },
      )
      if (!post) {
        throw new Error('Post not found')
      }

      io.emit('post:edit:' + post._id, post)

      return post
    } catch (error) {
      throw error
    }
  }

  public deletePost = async (postId: string, authorId: string) => {
    try {
      const post = await PostModel.findOneAndDelete({ _id: postId, authorId })
      if (!post) {
        throw new Error('Post not found or not authorized')
      }
      await CommentModel.deleteMany({ postId })

      io.emit('post:deleted', postId)

      return post
    } catch (error) {
      throw error
    }
  }

  public getAllPosts = async () => {
    try {
      const posts = await PostModel.aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'postId',
            as: 'comments',
            pipeline: [
              {
                $sort: { createdAt: 1 },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.authorId',
            foreignField: '_id',
            as: 'comments.authorId',
          },
        },
        {
          $unwind: {
            path: '$comments.authorId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'authorId',
          },
        },
        {
          $unwind: {
            path: '$authorId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            content: { $first: '$content' },
            createdAt: { $first: '$createdAt' },
            authorId: { $first: '$authorId' },
            comments: {
              $push: {
                $cond: {
                  if: { $eq: ['$comments', {}] },
                  then: '$$REMOVE',
                  else: '$comments',
                },
              },
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            _id: 1,
            authorId: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              profilePicture: 1,
            },
            createdAt: 1,
            content: 1,
            comments: {
              _id: 1,
              content: 1,
              createdAt: 1,
              authorId: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                profilePicture: 1,
              },
            },
          },
        },
      ])

      return posts
    } catch (error) {
      throw error
    }
  }
}
