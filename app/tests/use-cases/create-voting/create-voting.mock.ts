import { CreateVoting } from '@use-cases/create-voting/create-voting.business';

export const CreateVotingMock = {
  execute: jest.spyOn(CreateVoting.prototype, 'execute'),
};
