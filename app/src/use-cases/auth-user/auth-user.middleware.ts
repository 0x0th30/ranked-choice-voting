import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { UserValidator } from '@entities/user-validator';
import { AuthUserHTTPResponse } from './auth-user.d';
import { AuthUser } from './auth-user.business';

const AuthUserBusiness = new AuthUser(
  new PrismaClient(),
  new UserValidator(new PrismaClient()),
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
      responseContent.message = 'User successfully auth!';
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
