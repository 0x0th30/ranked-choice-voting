import { PrismaClient, Voting } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { v5 as uuid } from 'uuid';

export class WriteThrough {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async writeVotingSession(name: string, options: Array<string>): Promise<Voting> {
    const votingUUID = uuid(name, 'voting');
    const votingState = 'OPEN';

    const votingOptionsKey = `${votingUUID}:options`;
    const votingOptionsValue = options.join(',');
    await this.RedisManager.set(votingOptionsKey, votingOptionsValue);

    const votingStateKey = `${votingUUID}:state`;
    await this.RedisManager.set(votingStateKey, votingState);

    const voting = await this.PrismaManager.voting.create({
      data: {
        uuid: votingUUID, name, availableOptions: options, state: votingState,
      },
    }).then((value) => value);

    return voting;
  }
}
