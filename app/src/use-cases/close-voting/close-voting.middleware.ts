import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { CloseVoting } from './close-voting.business';
import { CloseVotingHTTPResponse } from './close-voting.d';

const CloseVotingBusiness = new CloseVoting(new PrismaClient());

export class CloseVotingMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CloseVotingHTTPResponse = { success: false };

    const { votingUUID } = request.params;
    const { user } = (request as any);

    const closeVoting = await CloseVotingBusiness.execute();

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
