import { WriteThrough } from '@repositories/write-through';

export const WriteThroughMock = {
  writeNewVoting: jest.spyOn(WriteThrough.prototype, 'writeNewVoting'),
};
