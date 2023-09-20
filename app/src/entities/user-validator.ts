import { AlreadyRegisteredEmail } from '@errors/user-validation-error';
import { PrismaClient } from '@prisma/client';

export class UserValidator {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async validateEmail(email: string): Promise<boolean> {
    const emailAlreadyRegistered = await this.PrismaManager.user.findFirst({
      where: { email },
    });
    if (emailAlreadyRegistered) throw new AlreadyRegisteredEmail(email);

    return true;
  }
}
