import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { PrismaClient } from '@prisma/client';
import { RedisClient } from '@loaders/redis';
import { Middleware } from '@contracts/middleware';
import { WriteThrough } from '@repositories/write-through';
import { CreateVoting } from './create-voting.business';
import { CreateVotingHTTPResponse } from './create-voting.d';

const PrismaManager = new PrismaClient();
const WriteThroughManager = new WriteThrough(
  PrismaManager,
  RedisClient as RedisClientType,
);
const CreateVotingBusiness = new CreateVoting(WriteThroughManager);

export class CreateVotingMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CreateVotingHTTPResponse = { success: false };

    const { uuid } = (request as any).user;
    const { name, options } = request.body;

    if (!name || !options) {
      responseContent.success = false;
      responseContent.message = 'Missing "name" and/or "options" fields in request body!';
      return response.status(400).json(responseContent);
    }

    const createVoting = await CreateVotingBusiness.execute(uuid, name, options);

    if (createVoting.success && createVoting.data) {
      responseContent.success = true;
      responseContent.data = { uuid: createVoting.data.uuid };
      return response.status(201).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
