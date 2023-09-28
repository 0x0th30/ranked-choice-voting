import { ExpiredToken, NotFoundToken, RevokedToken } from '@errors/token-error';
import { PrismaClient } from '@prisma/client';

export class UseToken {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async use(requesterUUID: string, token: string): Promise<void> {
    const searchToken = await this.PrismaManager.token.findFirst({
      where: { token, user_uuid: requesterUUID },
    });

    if (!searchToken) throw new NotFoundToken(token);

    if (searchToken.status === 'REVOKED') throw new RevokedToken(token);
    if (searchToken.status === 'EXPIRED') throw new ExpiredToken(token);

    await this.PrismaManager.token.update({
      where: { token, user_uuid: requesterUUID },
      data: { status: 'REVOKED' },
    });
  }
}
