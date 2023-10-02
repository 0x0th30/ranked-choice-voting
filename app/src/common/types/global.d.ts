declare global {
  type VotingToBeCreated = {
    name: string,
    availableOptions: Array<string>,
  }

  type VoteToBeCreated = {
    uuid: string,
    sequence: Array<string>,
  }

  type EmailToBeSent = {
    email: string,
    cc: Array<string>,
    subject: string,
    body: string,
  }
}

export {};
