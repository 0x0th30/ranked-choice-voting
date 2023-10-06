import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, UserState } from '@prisma/client';
import { logger } from '@utils/logger';
import { UserValidator } from '@entities/user-validator';
import { SendToken } from '@use-cases/send-token/send-token.business';
import { RegisterUserDTO } from './register-user.d';

export class RegisterUser {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly UserValidatorEntity: UserValidator,
    private readonly SendTokenBusiness: SendToken,
  ) {}

  public async execute(name: string, email: string, password: string)
    : Promise<RegisterUserDTO> {
    logger.info('Initializing "register-user" service/use-case...');
    const response: RegisterUserDTO = { success: false };

    await this.UserValidatorEntity.validateEmail(email)
      .then(() => { response.success = true; })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    if (response.success) {
      logger.info(`Generating UUID to user "${name}"...`);
      const uuid = uuidv4();

      logger.info(`Securing user "${name}" credentials...`);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const state: UserState = 'INACTIVE';

      logger.info(`Storing user "${name}" in database...`);
      const user = await this.PrismaManager.user.create({
        data: {
          uuid,
          name,
          email,
          password_hash: hash,
          state,
        },
      }).catch((error) => {
        logger.error(`Something went wrong during user storing. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

      if (user) {
        logger.info(`User "${name}" was successfully registered under id "${uuid}"!`);

        await this.SendTokenBusiness.execute(email, 'account-activation')
          .then((value) => {
            if (value.success) {
              response.success = true;
              response.data = { uuid };
            } else {
              response.success = false;
              response.error = value.error;
            }
          });
      }
    }

    logger.info('Finishing "register-user" service/use-case.');
    return response;
  }
}
