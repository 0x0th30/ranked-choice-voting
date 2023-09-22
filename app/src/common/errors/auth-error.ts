// eslint-disable-next-line max-classes-per-file
import { ApplicationError } from '@errors/application-error';

export abstract class AuthError extends ApplicationError {}

export class NotFoundUserUsingEmail extends AuthError {
  public email: string;

  constructor(email: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `No one user with "${email}" email was found.`;

    this.email = email;
  }
}

export class InvalidPassword extends AuthError {
  public uuid: string;

  constructor(uuid: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `Invalid password to user with "${uuid}" UUID.`;

    this.uuid = uuid;
  }
}

export class InactiveUser extends AuthError {
  public uuid: string;

  constructor(uuid: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `User with "${uuid}" UUID is currently inactive.`;

    this.uuid = uuid;
  }
}
