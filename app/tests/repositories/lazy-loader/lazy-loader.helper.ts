import { VotingState } from '@prisma/client';

export const Vote = {
  id: 1,
  voting_uuid: 'f@k3-uuid-h3r3',
  user_uuid: 'f@k3-uuid-h3r3',
  vote_sequence: ['option1', 'option2', 'option3'],
  created_at: new Date(),
  updated_at: new Date(),
};

export const Voting = {
  uuid: 'f@k3-uuid-h3r3',
  author_uuid: 'f@k3-uuid-h3r3',
  name: 'voting name',
  available_options: ['option1', 'option2', 'option3'],
  state: 'OPEN' as VotingState,
  created_at: new Date(),
  updated_at: new Date(),
};
