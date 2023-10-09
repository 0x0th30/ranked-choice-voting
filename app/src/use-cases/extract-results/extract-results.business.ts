import { NotFoundVoting, UnauthorizedVotingOperation } from '@errors/voting-error';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { ExtractResultsDTO } from './extract-results.d';

export class ExtractResults {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async execute(userUUID: string, votingUUID: string): Promise<ExtractResultsDTO> {
    logger.info('Initializing "extract-results" service/use-case...');
    const response: ExtractResultsDTO = { success: false };

    logger.info(`Searching by voting with uuid "${votingUUID}"`);
    const voting = await this.PrismaManager.voting
      .findFirst({ where: { uuid: votingUUID } });
    if (!voting) {
      response.success = false;
      response.error = new NotFoundVoting(votingUUID);
      return response;
    }

    logger.info(`Checking "${votingUUID}" author...`);
    const isUserVotingCreator = (voting.author_uuid === userUUID);
    if (!isUserVotingCreator) {
      response.success = false;
      response.error = new UnauthorizedVotingOperation(userUUID, votingUUID);
      return response;
    }

    logger.info(`Collecting voting "${votingUUID}" results...`);
    const votes = await this.PrismaManager.vote
      .findMany({ where: { voting_uuid: votingUUID } })
      .then((value) => {
        if (value) return value;
        return false;
      });

    if (!votes) return response;

    const scorePerOptions: { [key: string]: number } = {};
    voting.available_options.forEach((option) => { scorePerOptions[option] = 0; });

    votes.forEach((vote) => {
      const reversedOptionList = vote.vote_sequence.reverse();
      reversedOptionList.forEach((option) => {
        scorePerOptions[option] += reversedOptionList.indexOf(option) + 1;
      });
    });

    console.log(scorePerOptions);

    logger.info('Finishing "extract-results" service/use-case.');
    return response;
  }
}
