import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { InactiveUser, InvalidPassword, NotFoundUserUsingEmail }
  from '@errors/auth-error';
import { AuthUserHTTPResponse } from './activate-account';
import { AuthUser } from './activate-account';

const AuthUserBusiness = new AuthUser(
  new PrismaClient(),
);

export class AuthUserMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: AuthUserHTTPResponse = { success: false };

    const { email, password } = request.body;
    if (!email || !password) {
      responseContent.success = false;
      responseContent.message = 'Missing "email" and/or "password" field in '
        + 'request body!';
      return response.status(400).json(responseContent);
    }

    const authUser = await AuthUserBusiness.execute(email, password);

    if (authUser.success && authUser.data) {
      responseContent.success = true;
      responseContent.message = 'User is successfully auth!';
      return response
        .status(200)
        .header('auth-token', authUser.data.token)
        .json(responseContent);
    }

    if (authUser.error instanceof NotFoundUserUsingEmail
      || authUser.error instanceof InvalidPassword) {
      responseContent.success = false;
      responseContent.message = 'Cannot auth with provided credentials!';
      return response.status(401).json(responseContent);
    }

    if (authUser.error instanceof InactiveUser) {
      responseContent.success = false;
      responseContent.message = `User with email "${email}" is currently inactive!`;
      return response.status(403).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
