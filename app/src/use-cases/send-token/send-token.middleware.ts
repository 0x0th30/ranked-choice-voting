import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { TokenGenerator } from '@entities/token-generator';
import { SendTokenHTTPResponse } from './send-token.d';
import { SendToken } from './send-token.business';

const SendTokenBusiness = new SendToken(
  new TokenGenerator(new PrismaClient()),
);

export class SendTokenMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: SendTokenHTTPResponse = { success: false };

    const { email } = request.body;
    if (!email) {
      responseContent.success = false;
      responseContent.message = 'Missing "email" field in request body!';
      return response.status(400).json(responseContent);
    }

    const sendToken = await SendTokenBusiness.execute(email);

    if (sendToken.success) {
      responseContent.success = true;
      responseContent.message = 'Your token was successfully sent! Check your email box!';
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
