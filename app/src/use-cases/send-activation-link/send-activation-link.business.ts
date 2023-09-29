import { TokenGenerator } from '@entities/token-generator';
import { logger } from '@utils/logger';
import { SendActivationLinkDTO } from './send-activation-link.d';

export class SendActivationLink {
  constructor(
    private readonly TokenGeneratorEntity: TokenGenerator,
  ) { }

  public async execute(email: string)
    : Promise<SendActivationLinkDTO> {
    logger.info('Initializing "send-activation-link" service/use-case...');
    const response: SendActivationLinkDTO = { success: false };

    logger.info(`Generating activation token to user with email "${email}"...`);
    const token = await this.TokenGeneratorEntity.generate(email)
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    if (token) response.success = true;
    console.log(token);

    logger.info('Finishing "send-activation-link" service/use-case.');
    return response;
  }
}
