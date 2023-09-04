import { LazyLoader } from '@repositories/lazy-loader';
import { ClosedVoting, InvalidVotingOptions } from '@errors/vote-validation-error';
import { logger } from '@utils/logger';

export class VoteValidator {
  constructor(
    private readonly LazyLoaderManager: LazyLoader,
  ) {}

  private async checkVotingState(uuid: string): Promise<boolean> {
    logger.info(`Requesting "${uuid}" voting state to lazy-loader...`);
    const votingState = await this.LazyLoaderManager.readVotingState(uuid);

    logger.info(`"${uuid}" voting state is "${votingState}".`);
    if (votingState === 'OPEN') return true;
    throw new ClosedVoting(uuid);
  }

  private async checkVotingSequence(uuid: string, sequence: Array<string>)
    : Promise<boolean> {
    logger.info(`Requesting "${uuid}" voting valid options...`);
    const invalidVotingOptions: Array<string> = [];
    const validVotingOptions = await this.LazyLoaderManager.readVotingOptions(uuid);

    logger.info(`Checking if sequence "${sequence}" is valid to voting "${uuid}"...`);
    sequence.forEach((option) => {
      if (!validVotingOptions.includes(option)) invalidVotingOptions.push(option);
    });

    if (invalidVotingOptions.length === 0) return true;
    logger.error(`Received "${invalidVotingOptions}" invalid options to voting "${uuid}".`
    + ` Expecting "${validVotingOptions}" instead.`);
    throw new InvalidVotingOptions(uuid, validVotingOptions, invalidVotingOptions);
  }

  public async isVoteValid(vote: VoteToBeCreated): Promise<boolean> {
    logger.info('Validating received vote...');
    await this.checkVotingState(vote.uuid);
    await this.checkVotingSequence(vote.uuid, vote.sequence);

    logger.info('Received vote is valid!');
    return true;
  }
}
