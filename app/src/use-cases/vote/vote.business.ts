import { VoteValidator } from '@entities/vote-validator';
import { VoteDTO } from './create-voting.d';

export class Vote {
  constructor(
    private readonly VoteValidatorEntity: VoteValidator,
  ) {}

  public async execute(vote: VoteToBeCreated): Promise<VoteDTO> {
    const response: VoteDTO = { success: false };

    await this.VoteValidatorEntity.validateVote(vote)
      .then(() => { response.success = true; })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    return response;
  }
}
