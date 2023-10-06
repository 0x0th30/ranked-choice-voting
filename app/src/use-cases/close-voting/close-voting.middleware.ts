import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { NotAuthorClosingVoting, NotFoundVoting } from '@errors/voting-error';
import { CloseVoting } from './close-voting.business';
import { CloseVotingHTTPResponse } from './close-voting.d';

const CloseVotingBusiness = new CloseVoting(new PrismaClient());

export class CloseVotingMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CloseVotingHTTPResponse = { success: false };

    const votingUUID = request.params['uuid'];
    const userUUID = (request as any).user['uuid'];

    const closeVoting = await CloseVotingBusiness.execute(userUUID, votingUUID);

    if (closeVoting.success && closeVoting.data) {
      responseContent.success = true;
      responseContent.data = { uuid: closeVoting.data.uuid };
      return response.status(200).json(responseContent);
    }

    if (closeVoting.error instanceof NotAuthorClosingVoting) {
      responseContent.success = false;
      responseContent.message = 'Only voting author can close it!';
      return response.status(401).json(responseContent);
    }

    if (closeVoting.error instanceof NotFoundVoting) {
      responseContent.success = false;
      responseContent.message = `Cannot found voting "${votingUUID}"!`;
      return response.status(404).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
