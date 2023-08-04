import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { CreateVoting } from './create-voting.business';
import { CreateVotingHTTPResponse } from './create-voting.d';

const CreateVotingBusiness = new CreateVoting();

export class CreateVotingMiddleware implements Middleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CreateVotingHTTPResponse = { success: false };

    const { name, options } = request.body;

    if (!name || !options) {
      responseContent.success = false;
      responseContent.message = 'Missing "name" and/or "options" fields in request body!';
      return response.status(400).json(responseContent);
    }

    const createVoting = await CreateVotingBusiness.execute(name, options);

    if (createVoting.success && createVoting.data) {
      responseContent.success = true;
      responseContent.data = { sessionId: createVoting.data.sessionId };
      return response.status(201).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
