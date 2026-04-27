import { Request, Response, NextFunction } from 'express';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 24);

const cartSessionMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const sessionId = req.headers['x-session-id'] as string | undefined;
  req.sessionId = (sessionId && sessionId.length >= 8) ? sessionId : nanoid();
  next();
};

export default cartSessionMiddleware;
