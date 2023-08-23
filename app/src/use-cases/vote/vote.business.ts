import { LazyLoader } from '@repositories/lazy-loader';

export class Vote {
  constructor(
    private readonly LazyLoaderManager: LazyLoader,
  ) {}

  public async execute(vote: VoteToBeCreated): Promise<number> {
    
  }
}
