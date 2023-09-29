import { TokenGenerator } from '@entities/token-generator';
import { logger } from '@utils/logger';
import { SendTokenDTO } from './send-token.d';

export class SendToken {
  constructor(
    private readonly TokenGeneratorEntity: TokenGenerator,
  ) { }

  public async execute(email: string): Promise<SendTokenDTO> {
    logger.info('Initializing "send-token" service/use-case...');
    const response: SendTokenDTO = { success: false };

    logger.info(`Generating activation token to user with email "${email}"...`);
    const token = await this.TokenGeneratorEntity.generate(email)
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    if (token) response.success = true;
    console.log(token);

    logger.info('Finishing "send-token" service/use-case.');
    return response;
  }
}
