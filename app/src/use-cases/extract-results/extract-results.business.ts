import { NotFoundVoting, UnauthorizedVotingOperation } from '@errors/voting-error';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { ExtractResultsDTO } from './extract-results.d';

export class ExtractResults {
  constructor(
    private readonly PrismaManager: PrismaClient,
  ) {}

  private findWinner(voteCount: { [key: string]: number }): string {
    const voteEntries = Object.entries(voteCount);

    const numberOfVotes = voteEntries.length;
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

    const winner = voteEntries.reverse()[0][0];
    return winner;
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
      });
    if (!votes) return response;

    const voteCount: { [key: string]: number } = {};
    voting.available_options.forEach((option) => { voteCount[option] = 0; });

    votes.forEach((vote) => {
      const reversedOptionList = vote.vote_sequence.reverse();
      reversedOptionList.forEach((option) => {
        const individualScore = (reversedOptionList.indexOf(option) + 1);
        voteCount[option] += individualScore;
      });
    });

    const winner = this.findWinner(voteCount);

    response.success = true;
    response.data = { winner, voteCount };

    logger.info('Finishing "extract-results" service/use-case.');
    return response;
  }
}
