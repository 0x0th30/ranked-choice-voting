/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class VoteError extends ApplicationError {}

export class VotingOptionsSizeMismatch extends VoteError {
  public uuid: string;

  public expectedSize: number;

  public receivedSize: number;

  public validOptions: Array<string>;

  constructor(
    uuid: string,
    expectedSize: number,
    receivedSize: number,
    validOptions: Array<string>,
  ) {
    super();
    this.name = super.name;
    this.stack = super.stack;
    this.message = `"${uuid}" voting was expecting ${expectedSize} voting options `
      + `instead ${receivedSize}`;

    this.uuid = uuid;
    this.expectedSize = expectedSize;
    this.receivedSize = receivedSize;
    this.validOptions = validOptions;
  }
}

export class InvalidVotingOptions extends VoteError {
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
