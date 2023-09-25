import { Router } from 'express';
import { CreateVotingMiddleware }
  from '@use-cases/create-voting/create-voting.middleware';
import { VoteMiddleware } from '@use-cases/vote/vote.middleware';
import { RegisterUserMiddleware }
  from '@use-cases/register-user/register-user.middleware';
import { AuthUserMiddleware } from '@use-cases/auth-user/auth-user.middleware';
import { CheckAuthMiddleware } from '@use-cases/check-auth/check-auth.middleware';

const router = Router();

router.post(
  '/votings/create',
  new CheckAuthMiddleware().handle,
  new CreateVotingMiddleware().handle,
);
router.post(
  '/votings/:uuid/vote',
  new CheckAuthMiddleware().handle,
  new VoteMiddleware().handle,
);

router.post('/users/register', new RegisterUserMiddleware().handle);
router.post('/users/auth', new AuthUserMiddleware().handle);

export { router };
