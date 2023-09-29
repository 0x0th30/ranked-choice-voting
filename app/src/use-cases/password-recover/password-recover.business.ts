import bcrypt from 'bcryptjs';
import { UseToken } from '@entities/use-token';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { PasswordRecoverDTO } from './password-recover.d';

export class PasswordRecover {
  constructor(
    private readonly UseTokenEntity: UseToken,
    private readonly PrismaManager: PrismaClient,
  ) { }

  public async execute(email: string, password: string, token: string)
    : Promise<PasswordRecoverDTO> {
    logger.info('Initializing "password-recover" service/use-case...');
    const response: PasswordRecoverDTO = { success: false };

    logger.info(`Using provided token to recover user's account w/ email "${email}"...`);
    await this.UseTokenEntity.use(email, token)
      .then(async () => {
        logger.info('Securing new user credentials...');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        logger.info(`Recovering account with email "${email}"...`);
        await this.PrismaManager.user.update({
          where: { email },
          data: { password_hash: hash },
        });

        response.success = true;
      })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "password-recover" service/use-case.');
    return response;
  }
}
