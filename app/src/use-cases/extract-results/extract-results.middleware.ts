import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Middleware } from '@contracts/middleware';
import { UnauthorizedVotingOperation, NotFoundVoting } from '@errors/voting-error';
import { ExtractResults } from './extract-results.business';
import { ExtractResultsHTTPResponse } from './extract-results.d';

const ExtractResultsBusiness = new ExtractResults(
  new PrismaClient(),
);

export class ExtractResultsMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: ExtractResultsHTTPResponse = { success: false };

    const { user } = (request as any);
    const { uuid } = request.params;

    const extractResults = await ExtractResultsBusiness.execute(user.uuid, uuid);

    if (extractResults.success && extractResults.data) {
      responseContent.success = true;
      responseContent.data = {
        winner: extractResults.data.winner,
        voteCount: extractResults.data.voteCount,
      };
      return response.status(200).json(responseContent);
    }

    if (extractResults.error instanceof UnauthorizedVotingOperation) {
      responseContent.success = false;
      responseContent.message = 'Only voting author can close it!';
      return response.status(401).json(responseContent);
    }

    if (extractResults.error instanceof NotFoundVoting) {
      responseContent.success = false;
      responseContent.message = `Cannot found voting "${uuid}"!`;
      return response.status(404).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
