import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { VoteValidator } from '@entities/vote-validator';
import { LazyLoader } from '@repositories/lazy-loader';
import { RedisClient } from '@loaders/redis';
import {
  ClosedVoting,
  InvalidVotingOptions,
  NotFoundVoting,
  VotingOptionsSizeMismatch,
} from '@errors/vote-validation-error';
import { Vote } from './vote.business';
import { VoteHTTPResponse } from './vote.d';

const PrismaManager = new PrismaClient();
const LazyLoaderManager = new LazyLoader(PrismaManager, RedisClient as RedisClientType);
const VoteValidatorEntity = new VoteValidator(LazyLoaderManager);
const VoteBusiness = new Vote(VoteValidatorEntity);

export class VoteMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: VoteHTTPResponse = { success: false };

    const { uuid } = request.params;
    const { sequence } = request.body;

    if (!sequence) {
      responseContent.success = false;
      responseContent.message = 'Missing "sequence" field in request body!';
      return response.status(400).json(responseContent);
    }

    const vote: VoteToBeCreated = { uuid, sequence };
    const createVote = await VoteBusiness.execute(vote);

    if (createVote.success) {
      responseContent.success = true;
      responseContent.message = 'Vote was successfully processed! You\'ll receive an '
        + 'confirmation email when it be stored.';
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

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
