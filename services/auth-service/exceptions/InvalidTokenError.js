import AppError from './AppError.js';

export default class InvalidTokenError extends AppError {
  constructor(type = 'Access') {
    super(401, 'INVALID_TOKEN', `${type} token is invalid or expired`);
  }
}