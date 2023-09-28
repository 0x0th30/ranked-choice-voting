// eslint-disable-next-line max-classes-per-file
import { ApplicationError } from '@errors/application-error';

export abstract class TokenError extends ApplicationError {}

export class NotFoundToken extends TokenError {
  public token: string;

  constructor(token: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `No one token "${token}" was found.`;

    this.token = token;
  }
}

export class RevokedToken extends TokenError {
  public token: string;

  constructor(token: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${token}" was already used.`;

    this.token = token;
  }
}

export class ExpiredToken extends TokenError {
  public token: string;

  constructor(token: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${token}" is currently expired.`;

    this.token = token;
  }
}
