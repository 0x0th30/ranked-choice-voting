import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { UseToken } from '@entities/use-token';
import { NotFoundToken, RevokedToken, ExpiredToken } from '@errors/token-error';
import { ActivateAccountHTTPResponse } from './activate-account.d';
import { ActivateAccount } from './activate-account.business';

const ActivateAccountBusiness = new ActivateAccount(
  new UseToken(new PrismaClient()),
  new PrismaClient(),
);

export class ActivateAccountMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: ActivateAccountHTTPResponse = { success: false };

    const { user } = request as any;
    const { token } = request.params;
    if (!token) {
      responseContent.success = false;
      responseContent.message = 'Missing "token" query parameter!';
      return response.status(400).json(responseContent);
    }

    const activateAccount = await ActivateAccountBusiness.execute(user.uuid, token);

    if (activateAccount.success) {
      responseContent.success = true;
      responseContent.message = 'Your account was successfully activated!';
      return response.status(200).json(responseContent);
    }

    if (activateAccount.error instanceof NotFoundToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token does not exists!';
      return response.status(400).json(responseContent);
    }

    if (activateAccount.error instanceof RevokedToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token was already revoked!';
      return response.status(400).json(responseContent);
    }

    if (activateAccount.error instanceof ExpiredToken) {
      responseContent.success = false;
      responseContent.message = 'The provided token was already expired!';
      return response.status(400).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
