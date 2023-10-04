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

export class VotingExceedingOptionsLimit extends VotingError {
  public optionsLimit: number;

  public optionsLength: number;

  constructor(optionsLimit: number, optionsLength: number) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `Received ${optionsLength} options, allowed limit is ${optionsLimit}!`;

    this.optionsLimit = optionsLimit;
    this.optionsLength = optionsLength;
  }
}
