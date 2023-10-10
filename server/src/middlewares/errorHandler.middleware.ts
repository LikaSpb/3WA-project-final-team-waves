import { NextFunction, Request, Response } from 'express';
import { CODERESPONSE } from '../constants/CodeResponse'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || CODERESPONSE.BAD_REQUEST;
  const message = err.message || 'An error occurred';

  res.status(statusCode).json({
    error: message
  });
}
