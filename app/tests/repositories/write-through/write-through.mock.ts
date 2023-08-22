import { WriteThrough } from '@repositories/write-through';

export const WriteThroughMock = {
  writeVoting: jest.spyOn(WriteThrough.prototype, 'writeVoting'),
};
