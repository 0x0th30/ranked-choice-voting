import { NotFoundVoting, UnauthorizedVotingOperation } from '@errors/voting-error';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { ExtractResultsDTO } from './extract-results.d';

export class ExtractResults {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  private findMostVotedOption(voteCount: { [key: string]: number }): string {
    const voteEntries = Object.entries(voteCount);

    const numberOfVotes = voteEntries.length;
    const lastIndex = numberOfVotes - 1;
    let indexCounter = 1;

    while (indexCounter < numberOfVotes) {
      const currentVote = voteEntries[indexCounter];
      let previousIndex = indexCounter - 1;

      while (previousIndex >= 0 && voteEntries[previousIndex][1] > currentVote[1]) {
        voteEntries[previousIndex + 1] = voteEntries[previousIndex];
        previousIndex -= 1;
      }

      voteEntries[previousIndex + 1] = currentVote;
      indexCounter += 1;
    }

    const mostVotedOption = voteEntries[lastIndex][0];
    return mostVotedOption;
  }

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
      })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });
    if (!votes) return response;

    logger.info(`Starting vote counting to voting "${votingUUID}"...`);
    const voteCount: { [key: string]: number } = {};
    voting.available_options.forEach((option) => { voteCount[option] = 0; });

    logger.info(`Count score to each voting "${votingUUID}" option...`);
    votes.forEach((vote) => {
      const reversedOptionList = vote.vote_sequence.reverse();
      reversedOptionList.forEach((option) => {
        const individualScore = (reversedOptionList.indexOf(option) + 1);
        voteCount[option] += individualScore;
      });
    });

    logger.info(`Selecting winner to voting "${votingUUID}"...`);
    const winner = this.findMostVotedOption(voteCount);

    response.success = true;
    response.data = { winner, voteCount };

    logger.info('Finishing "extract-results" service/use-case.');
    return response;
  }
}
