import { CustomError } from './custom.error';

export class ConflictErrorJSON extends CustomError {
  statusCode = 409;

  constructor() {
    super('Conflict Error');

    Object.setPrototypeOf(this, ConflictErrorJSON.prototype);
  }

  serializeErrors() {
    return [{ message: 'Conflict Error' }];
  }
}
