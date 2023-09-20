// eslint-disable-next-line max-classes-per-file
import { ApplicationError } from '@errors/application-error';

export abstract class RegisteringError extends ApplicationError {}

export class AlreadyRegisteredEmail extends RegisteringError {
  public email: string;

  constructor(email: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${email}" email it's already registered by another user.`;

    this.email = email;
  }
}
