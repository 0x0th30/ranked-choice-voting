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

    const user = await this.PrismaManager.user.findFirst({ where: { email } });
    if (!user) {
      response.success = false;
      response.error = new NotFoundUserUsingEmail(email);
      return response;
    }
    if (user.state === 'INACTIVE') {
      response.success = false;
      response.error = new InactiveUser(user.uuid);
      return response;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      response.success = false;
      response.error = new InvalidPassword(user.uuid);
      return response;
    }

    logger.info('Finishing "auth-user" service/use-case.');
    return response;
  }
}
