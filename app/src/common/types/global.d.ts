declare global {
  type VotingToBeCreated = {
    name: string,
    availableOptions: Array<string>,
  }

  type VoteToBeCreated = {
    uuid: string,
    sequence: Array<string>,
  }
}

export {};
