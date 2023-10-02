import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { NotFoundUserUsingEmail } from '@errors/auth-error';

export class TokenGenerator {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async generate(email: string): Promise<string> {
    const user = await this.PrismaManager.user.findFirst({ where: { email } });
    if (!user) throw new NotFoundUserUsingEmail(email);

    const token = crypto.randomBytes(64).toString('hex');

    const status = 'UNUSED';
    const expiryTime = new Date();

    const writeToken = await this.PrismaManager.token.create({
      data: {
        token,
        status,
        expiry_time: expiryTime,
        user_email: email,
      },
    });

    return writeToken.token;
  }
}
