import { IsString, IsNotEmpty, IsMongoId } from 'class-validator'

export class PostDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsMongoId()
  authorId: string
}
