import { Voting } from '@prisma/client';
import { CreateVoting } from '@use-cases/create-voting/create-voting.business';
import { WriteThrough } from '@repositories/write-through';
import { WriteThroughMock } from '../../repositories/write-through/write-through.mock';
import { CreatedVoting } from '../../repositories/write-through/write-through.helper';
import { SuccessCreateVotingDTO } from './create-voting.helper';

const name = 'voting name';
const options = ['option1', 'option2', 'option3'];

const CreateVotingSUT = new CreateVoting(WriteThroughMock as any as WriteThrough);

describe('CreateVoting class', () => {
  describe('(public) execute method', () => {
    it('should create/return voting if provided valid name/options', () => {
      WriteThroughMock.writeNewVoting.mockResolvedValueOnce(CreatedVoting as Voting);

      CreateVotingSUT.execute(name, options).then((response) => {
        expect(response).toEqual(SuccessCreateVotingDTO);
      });
    });
    it('should call "WriteThroughManager.writeNewVoting" to persist voting', () => {
      WriteThroughMock.writeNewVoting.mockResolvedValueOnce(CreatedVoting as Voting);

      CreateVotingSUT.execute(name, options).then(() => {
        expect(WriteThroughMock.writeNewVoting).toBeCalled();
      });
    });
    it('should call "WriteThroughManager.writeNewVoting" w/ provided'
    + ' name/options', () => {
      WriteThroughMock.writeNewVoting.mockResolvedValueOnce(CreatedVoting as Voting);

      CreateVotingSUT.execute(name, options).then(() => {
        expect(WriteThroughMock.writeNewVoting).toBeCalledWith(name, options);
      });
    });
    it('should set "success" to "true" when voting creation is successful', () => {
      WriteThroughMock.writeNewVoting.mockResolvedValueOnce(CreatedVoting as Voting);

      CreateVotingSUT.execute(name, options).then((response) => {
        expect(response.success).toEqual(true);
      });
    });
    it('should set return "data" with UUID when voting creation is successful', () => {
      WriteThroughMock.writeNewVoting.mockResolvedValueOnce(CreatedVoting as Voting);

      CreateVotingSUT.execute(name, options).then((response) => {
        expect(response.data).toBeTruthy();
        expect(response.data?.uuid).toBeTruthy();
      });
    });
    it('should set "success" to "false" when voting creation fail', () => {
      WriteThroughMock.writeNewVoting.mockRejectedValueOnce(new Error('GENERIC_ERROR'));

      CreateVotingSUT.execute(name, options).then((response) => {
        expect(response.success).toEqual(false);
      });
    });
    it('should set return "error" when voting creation fail', () => {
      WriteThroughMock.writeNewVoting.mockRejectedValueOnce(new Error('GENERIC_ERROR'));

      CreateVotingSUT.execute(name, options).then((response) => {
        expect(response.error).toBeTruthy();
      });
    });
  });
});
