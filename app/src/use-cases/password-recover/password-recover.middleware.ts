import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { UseToken } from '@entities/use-token';
import { NotFoundToken, RevokedToken, ExpiredToken } from '@errors/token-error';
import { PasswordRecoverHTTPResponse } from './password-recover.d';
import { PasswordRecover } from './password-recover.business';

const PasswordRecoverBusiness = new PasswordRecover(
  new UseToken(new PrismaClient()),
  new PrismaClient(),
);

export class PasswordRecoverMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: PasswordRecoverHTTPResponse = { success: false };

    const { email, password } = request.body;
    const { token } = request.params;
    if (!email || !password) {
      responseContent.success = false;
      responseContent.message = 'Missing "email" and/or "password" field in '
        + 'request body!';
      return response.status(400).json(responseContent);
    }
    if (!token) {
      responseContent.success = false;
      responseContent.message = 'Missing "token" query parameter!';
      return response.status(400).json(responseContent);
    }

    const passwordRecover = await PasswordRecoverBusiness.execute(email, password, token);

    if (passwordRecover.success) {
      responseContent.success = true;
      responseContent.message = 'Your account was successfully updated!';
      return response.status(200).json(responseContent);
    }

    if (passwordRecover.error instanceof NotFoundToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token does not exists!';
      return response.status(400).json(responseContent);
    }

    if (passwordRecover.error instanceof RevokedToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token was already revoked!';
      return response.status(400).json(responseContent);
    }

    if (passwordRecover.error instanceof ExpiredToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token was already expired!';
      return response.status(400).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
