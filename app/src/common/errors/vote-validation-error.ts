/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class VotingError extends ApplicationError {}

export class NotFoundVoting extends VotingError {
  public uuid: string;

  constructor(uuid: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${uuid}" references a not found voting.`;

    this.uuid = uuid;
  }
}

export class ClosedVoting extends VotingError {
  public uuid: string;

  constructor(uuid: string) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${uuid}" references a closed voting.`;

    this.uuid = uuid;
  }
}

export class InvalidVotingOptions extends VotingError {
  public uuid: string;

  public validOptions: Array<string>;

  public invalidOptions: Array<string>;

  constructor(
    uuid: string,
    validOptions: Array<string>,
    invalidOptions: Array<string>,
  ) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `Values "${invalidOptions}" is invalid to "${uuid}" voting.`
    + ` Expecting "${validOptions}"`;

    this.uuid = uuid;
    this.validOptions = validOptions;
    this.invalidOptions = invalidOptions;
  }
}