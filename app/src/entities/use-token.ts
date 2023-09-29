import { PrismaClient } from '@prisma/client';
import { ExpiredToken, NotFoundToken, RevokedToken } from '@errors/token-error';
import { logger } from '@utils/logger';

export class UseToken {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async use(email: string, token: string): Promise<void> {
    logger.info(`Searching by token "${token}"...`);
    const searchToken = await this.PrismaManager.token.findFirst({
      where: { token, user_email: email },
    });

    if (!searchToken) {
      logger.error(`Cannot found no one token "${token}" to user w/ email "${email}"!`);
      throw new NotFoundToken(token);
    }

    logger.info(`Token "${token}" is currently "${searchToken.status}"!`);
    if (searchToken.status === 'REVOKED') throw new RevokedToken(token);
    if (searchToken.status === 'EXPIRED') throw new ExpiredToken(token);

    logger.info(`Updating token "${token}" status to "REVOKED"!`);
    await this.PrismaManager.token.update({
      where: { token, user_email: email },
      data: { status: 'REVOKED' },
    });
  }
}
