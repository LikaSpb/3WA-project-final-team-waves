import { IsString } from 'class-validator'

export class CommentDto {
  @IsString()
  content: string

  @IsString()
  postId: string

  @IsString()
  authorId: string
}

export class UpdateCommentDto {
  @IsString()
  content: string

  @IsString()
  authorId: string
}
