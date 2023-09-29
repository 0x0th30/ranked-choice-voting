import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { TokenGenerator } from '@entities/token-generator';
import { NotFoundToken, RevokedToken, ExpiredToken } from '@errors/token-error';
import { SendActivationLinkHTTPResponse } from './send-activation-link.d';
import { SendActivationLink } from './send-activation-link.business';

const SendActivationLinkBusiness = new SendActivationLink(
  new TokenGenerator(new PrismaClient()),
);

export class SendActivationLinkMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: SendActivationLinkHTTPResponse = { success: false };

    const uuid = (request as any).user as string;
    const { token } = request.params;
    if (!token) {
      responseContent.success = false;
      responseContent.message = 'Missing "token" query parameter!';
      return response.status(400).json(responseContent);
    }

    const sendActivationLink = await SendActivationLinkBusiness.execute(uuid);

    if (sendActivationLink.success) {
      responseContent.success = true;
      responseContent.message = 'User is successfully auth!';
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
