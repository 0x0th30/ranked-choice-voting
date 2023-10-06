import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { UserValidator } from '@entities/user-validator';
import { AlreadyRegisteredEmail } from '@errors/user-validation-error';
import { SendToken } from '@use-cases/send-token/send-token.business';
import { TokenGenerator } from '@entities/token-generator';
import { RabbitMQ } from '@loaders/rabbitmq';
import { RegisterUserHTTPResponse } from './register-user.d';
import { RegisterUser } from './register-user.business';

const RegisterUserBusiness = new RegisterUser(
  new PrismaClient(),
  new UserValidator(new PrismaClient()),
  new SendToken(
    new TokenGenerator(new PrismaClient()),
    new RabbitMQ(),
  ),
);

export class RegisterUserMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: RegisterUserHTTPResponse = { success: false };

    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      responseContent.success = false;
      responseContent.message = 'Missing "name", "email" and/or "password" field in '
      + 'request body!';
      return response.status(400).json(responseContent);
    }

    const registerUser = await RegisterUserBusiness.execute(name, email, password);

    if (registerUser.success && registerUser.data) {
      responseContent.success = true;
      responseContent.data = { uuid: registerUser.data.uuid };
      responseContent.message = 'Check your email box to activate account!';
      return response.status(200).json(responseContent);
    }

    if (registerUser.error instanceof AlreadyRegisteredEmail) {
      responseContent.success = false;
      responseContent.message = `Email "${registerUser.error.email}" it's already `
      + 'registered by another user!';
      return response.status(400).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
