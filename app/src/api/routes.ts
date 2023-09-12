import { Router } from 'express';
import { CreateVotingMiddleware }
  from '@use-cases/create-voting/create-voting.middleware';
import { VoteMiddleware } from '@use-cases/vote/vote.middleware';

const router = Router();

router.post('/create', new CreateVotingMiddleware().handle);
router.post('/:uuid/vote', new VoteMiddleware().handle);

export { router };
