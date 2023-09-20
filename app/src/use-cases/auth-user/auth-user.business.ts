import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, UserState } from '@prisma/client';
import { logger } from '@utils/logger';
import { UserValidator } from '@entities/user-validator';
import { AuthUserDTO } from './auth-user.d';

export class AuthUser {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly UserValidatorEntity: UserValidator,
  ) { }

  public async execute(email: string, password: string)
    : Promise<AuthUserDTO> {
    logger.info('Initializing "auth-user" service/use-case...');
    const response: AuthUserDTO = { success: false };

    logger.info('Finishing "auth-user" service/use-case.');
    return response;
  }
}
