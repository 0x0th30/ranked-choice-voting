import { UseToken } from '@entities/use-token';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { ActivateAccountDTO } from './activate-account.d';

export class ActivateAccount {
  constructor(
    private readonly UseTokenEntity: UseToken,
    private readonly PrismaManager: PrismaClient,
  ) { }

  public async execute(email: string, token: string)
    : Promise<ActivateAccountDTO> {
    logger.info('Initializing "activate-account" service/use-case...');
    const response: ActivateAccountDTO = { success: false };

    logger.info(`Using provided token to activate user's account w/ email "${email}"...`);
    await this.UseTokenEntity.use(email, token)
      .then(async () => {
        logger.info(`Activating account with email "${email}"...`);
        await this.PrismaManager.user.update({
          where: { email },
          data: { state: 'ACTIVE' },
        });

        response.success = true;
      })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "activate-account" service/use-case.');
    return response;
  }
}
