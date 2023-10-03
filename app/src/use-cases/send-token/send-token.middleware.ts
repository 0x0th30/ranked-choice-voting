import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { TokenGenerator } from '@entities/token-generator';
import { RabbitMQ } from '@loaders/rabbitmq';
import { NotFoundUserUsingEmail } from '@errors/auth-error';
import { SendTokenHTTPResponse } from './send-token.d';
import { SendToken } from './send-token.business';

const SendTokenBusiness = new SendToken(
  new TokenGenerator(new PrismaClient()),
  new RabbitMQ(),
);

export class SendTokenMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: SendTokenHTTPResponse = { success: false };

    const { email, reason } = request.params;
    if (!email) {
      responseContent.success = false;
      responseContent.message = 'Missing "email" parameter!';
      return response.status(400).json(responseContent);
    }

    const sendToken = await SendTokenBusiness.execute(email, reason as TokenReason);

    if (sendToken.success) {
      responseContent.success = true;
      responseContent.message = 'Your token was successfully sent! Check your email box!';
      return response.status(200).json(responseContent);
    }

    if (sendToken.error instanceof NotFoundUserUsingEmail) {
      responseContent.success = false;
      responseContent.message = `Not found user with email "${email}"! `
        + 'Register yourself first.';
      return response.status(403).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
