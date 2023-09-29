import { UseToken } from '@entities/use-token';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { ActivateAccountDTO } from './activate-account.d';

export class ActivateAccount {
  constructor(
    private readonly UseTokenEntity: UseToken,
    private readonly PrismaManager: PrismaClient,
  ) { }

  public async execute(uuid: string, token: string)
    : Promise<ActivateAccountDTO> {
    logger.info('Initializing "activate-account" service/use-case...');
    const response: ActivateAccountDTO = { success: false };

    logger.info(`Using provided token to activate user's account with uuid "${uuid}"...`);
    await this.UseTokenEntity.use(uuid, token)
      .then(async () => {
        logger.info(`Activating account with uuid "${uuid}"...`);
        await this.PrismaManager.user.update({
          where: { uuid },
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
