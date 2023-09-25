import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { InactiveUser, InvalidPassword, NotFoundUserUsingEmail }
  from '@errors/auth-error';
import { logger } from '@utils/logger';
import { AuthUserDTO } from './auth-user.d';

export class AuthUser {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) { }

  public async execute(email: string, password: string)
    : Promise<AuthUserDTO> {
    logger.info('Initializing "auth-user" service/use-case...');
    const response: AuthUserDTO = { success: false };

    logger.info(`Searching by user with email "${email}" in database...`);
    const user = await this.PrismaManager.user.findFirst({ where: { email } })
      .catch((error) => {
        logger.error(`Something went wrong during database search. Details: ${error}`);
      });

    if (!user) {
      logger.error(`No users registered with email "${email}"!`);
      response.success = false;
      response.error = new NotFoundUserUsingEmail(email);
      return response;
    }

    logger.info(`Checking user "${email}" credentials...`);
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      logger.error(`Invalid credentials to user with email "${email}"!`);
      response.success = false;
      response.error = new InvalidPassword(user.uuid);
      return response;
    }
    logger.info(`Credentials to user with email "${email}" was successfully validated.`);

    // if (user.state === 'INACTIVE') {
    //   logger.error(`Account registered with email "${email}" is currently inactive!`);
    //   response.success = false;
    //   response.error = new InactiveUser(user.uuid);
    //   return response;
    // }

    logger.info(`Generating JWT token to user with email "${email}"...`);
    const TOKEN_SECRET = process.env['TOKEN_SECRET'] as string;
    const token = jwt.sign({ uuid: user.uuid }, TOKEN_SECRET);
    logger.info(`JWT token to user with email "${email}" was successfully generated.`);

    response.success = true;
    response.data = { token };

    logger.info('Finishing "auth-user" service/use-case.');
    return response;
  }
}
