import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { IUser, IUserRole } from 'interfaces/users.interface'
import userSchema from '../models/User.model'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HydratedDocument } from 'mongoose'
import bcrypt from 'bcrypt'
import { CODERESPONSE } from 'constants/CodeResponse'

export interface RequestWithUser extends Request {
  user: IUser
}

export function validationMiddleware(type: any): any {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ')
        res.status(CODERESPONSE.NOT_FOUND).send(message)
      } else {
        next()
      }
    })
  }
}

export async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  try {
    // Récupérer le token depuis les cookies
    const tokenBeared = req.cookies['Authorization']
    if (!tokenBeared) throw new Error('Token not found !!')

    const token = tokenBeared.split(' ')[1]

    // Vérifier le token et récupérer le User-Agent du token décodé
    const decodedToken: JwtPayload = jwt.verify(
      token,
      process.env.SECRET_KEY,
    ) as JwtPayload

    // Récupérer l'utilisateur depuis la base de données
    const userId = decodedToken.id
    const user: HydratedDocument<IUser> = await userSchema.findById(userId)
    if (!user) throw new Error('User not found !!')

    // Vérifiez le rôle de l'utilisateur
    if (user.role !== decodedToken.role) throw new Error('Error with role !!')

    if (!bcrypt.compare(req.headers['user-agent'], user.agent))
      throw new Error('Error agent sender')

    req.user = user

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(CODERESPONSE.UNAUTHORIZED).json({ error: error.message })
    } else {
      res.status(CODERESPONSE.UNAUTHORIZED).json({ error: error.message })
    }
  }
}
