import {
  IsEmail,
  IsString,
  IsDateString,
  IsStrongPassword,
  IsOptional,
} from 'class-validator'

export class UserDto {
  @IsString()
  firstname: string
  @IsString()
  lastname: string
  @IsDateString()
  dateOfBirth: Date
  @IsEmail()
  email: string
  @IsString()
  jobTitle: string
  @IsString()
  company: string
  @IsStrongPassword()
  password: string
  @IsString()
  @IsOptional()
  picture?: string
}

export class LoginUserDto {
  @IsEmail()
  email: string
  @IsStrongPassword()
  password: string
}

export class EditPasswordDto {
  @IsStrongPassword()
  oldPassword: string
  @IsStrongPassword()
  newPassword: string
}
