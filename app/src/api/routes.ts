import { Router } from 'express';
import { CreateVotingMiddleware }
  from '@use-cases/create-voting/create-voting.middleware';
import { VoteMiddleware } from '@use-cases/vote/vote.middleware';

const router = Router();

router.post('/votings/create', new CreateVotingMiddleware().handle);
router.post('/votings/:uuid/vote', new VoteMiddleware().handle);

router.post('/user/register');

export { router };
