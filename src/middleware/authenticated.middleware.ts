import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import userModel from '../resources/user/user.model';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

export default async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: Function
): Promise<Response | void> {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer')) {
    return next(new HttpException(401, 'unauthorized'));
  }

  const accessToken = bearer.split(' ')[1];
  try {
    const payload: Token | jwt.JsonWebTokenError = await verifyToken(
      accessToken
    );
    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'unauthorized'));
    }
    const user = await userModel
      .findById(payload.id)
      .select('-password')
      .exec();
    if (!user) {
      return next(new HttpException(401, 'unauthorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new HttpException(401, 'unauthorized'));
  }
}
