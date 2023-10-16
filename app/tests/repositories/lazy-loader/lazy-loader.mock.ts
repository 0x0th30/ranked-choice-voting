import { LazyLoader } from '@repositories/lazy-loader';

export const LazyLoaderMock = {
  isUniqueVotePerUser: jest.spyOn(LazyLoader.prototype, 'isUniqueVotePerUser'),
  readVotingState: jest.spyOn(LazyLoader.prototype, 'readVotingState'),
  readVotingOptions: jest.spyOn(LazyLoader.prototype, 'readVotingOptions'),
};
