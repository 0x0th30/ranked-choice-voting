import { Router } from 'express';
import { CreateVotingMiddleware }
  from '@use-cases/create-voting/create-voting.middleware';

const router = Router();

router.use('/session');
router.post('/create', new CreateVotingMiddleware().handle);

export { router };
