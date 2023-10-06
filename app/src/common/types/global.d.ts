declare global {
  type VotingToBeCreated = {
    name: string,
    availableOptions: Array<string>,
  }

  type VoteToBeCreated = {
    uuid: string,
    userUUID: string,
    sequence: Array<string>,
  }

  type EmailToBeSent = {
    email: string,
    subject: string,
    body: string,
  }

  type TokenReason = 'password-recover' | 'account-activation';
}

export {};
