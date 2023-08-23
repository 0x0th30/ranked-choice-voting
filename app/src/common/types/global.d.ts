declare global {
  type VotingToBeCreated = {
    name: string,
    availableOptions: Array<string>,
  }

  type VoteToBeCreated = {
    votingUuid: string,
    voteSequence: Array<string>,
  }
}

export {};
