import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { VoteValidator } from '@entities/vote-validator';
import { RabbitMQ } from '@loaders/rabbitmq';
import { LazyLoader } from '@repositories/lazy-loader';
import { RedisClient } from '@loaders/redis';
import { ClosedVoting, NotFoundVoting } from '@errors/voting-error';
import {
  InvalidVotingOptions,
  NonUniqueVotePerUser,
  VotingOptionsSizeMismatch,
} from '@errors/vote-validation-error';
import { Vote } from './vote.business';
import { VoteHTTPResponse } from './vote.d';

const LazyLoaderManager = new LazyLoader(
  new PrismaClient(),
  RedisClient as RedisClientType,
);
const VoteBusiness = new Vote(
  new VoteValidator(LazyLoaderManager),
  new RabbitMQ(),
);

export class VoteMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: VoteHTTPResponse = { success: false };

    const { user } = (request as any);
    const { uuid } = request.params;
    const { sequence } = request.body;

    if (!sequence) {
      responseContent.success = false;
      responseContent.message = 'Missing "sequence" field in request body!';
      return response.status(400).json(responseContent);
    }

    const vote: VoteToBeCreated = { uuid, userUUID: user.uuid, sequence };
    const createVote = await VoteBusiness.execute(vote);

    if (createVote.success) {
      responseContent.success = true;
      responseContent.message = 'Vote was successfully processed!';
      return response.status(202).json(responseContent);
    }

    if (createVote.error instanceof ClosedVoting) {
      responseContent.success = false;
      responseContent.message = `Voting "${vote.uuid}" is currently close!`;
      return response.status(422).json(responseContent);
    }

    if (createVote.error instanceof InvalidVotingOptions) {
      responseContent.success = false;
      responseContent.message = `Invalid voting options to voting "${vote.uuid}"! `
        + `Cannot process values "${createVote.error.invalidOptions}", `
        + `expecting valid options: "${createVote.error.validOptions}".`;
      return response.status(400).json(responseContent);
    }

    if (createVote.error instanceof VotingOptionsSizeMismatch) {
      responseContent.success = false;
      responseContent.message = `Invalid voting options to voting "${vote.uuid}"! `
        + `Received ${createVote.error.receivedSize} options instead `
        + `${createVote.error.expectedSize}. `
        + `Valid options: "${createVote.error.validOptions}". `
        + 'Repeated values will be ignored.';
      return response.status(400).json(responseContent);
    }

    if (createVote.error instanceof NotFoundVoting) {
      responseContent.success = false;
      responseContent.message = `Cannot found voting "${vote.uuid}"!`;
      return response.status(404).json(responseContent);
    }

    if (createVote.error instanceof NonUniqueVotePerUser) {
      responseContent.success = false;
      responseContent.message = `User "${vote.userUUID}" already send your vote to `
        + `voting "${vote.uuid}"!`;
      return response.status(422).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
