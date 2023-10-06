import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from '@contracts/middleware';
import { CheckAuthHTTPResponse } from './check-auth.d';

export class CheckAuthMiddleware implements Middleware {
  public async handle(request: Request, response: Response, next: NextFunction)
  : Promise<Response | void> {
    const responseContent: CheckAuthHTTPResponse = { success: false };

    const TOKEN_SECRET = process.env['TOKEN_SECRET'] as string;
    const token = request.header('auth-token');

    if (!token) {
      responseContent.success = false;
      responseContent.message = 'Missing auth token!';
      return response.status(401).json(responseContent);
    }

    try {
      const verified = jwt.verify(token, TOKEN_SECRET);
      (request as any).user = verified;
      return next();
    } catch (error) {
      responseContent.success = false;
      responseContent.message = 'Invalid auth token!';
      return response.status(400).json(responseContent);
    }
  }
}
