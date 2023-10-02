import { Router } from 'express';
import { CreateVotingMiddleware }
  from '@use-cases/create-voting/create-voting.middleware';
import { VoteMiddleware } from '@use-cases/vote/vote.middleware';
import { RegisterUserMiddleware }
  from '@use-cases/register-user/register-user.middleware';
import { AuthUserMiddleware } from '@use-cases/auth-user/auth-user.middleware';
import { CheckAuthMiddleware } from '@use-cases/check-auth/check-auth.middleware';
import { ActivateAccountMiddleware }
  from '@use-cases/activate-account/activate-account.middleware';
import { SendTokenMiddleware } from '@use-cases/send-token/send-token.middleware';
import { PasswordRecoverMiddleware }
  from '@use-cases/password-recover/password-recover.middleware';

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
router.post('/users/:reason/send-token', new SendTokenMiddleware().handle);
router.post('/users/:token/activate-account', new ActivateAccountMiddleware().handle);
router.post('/users/:token/password-recover', new PasswordRecoverMiddleware().handle);

export { router };
