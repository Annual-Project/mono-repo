import AppError from './AppError';

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, 'BAD_REQUEST', message);
  }
}

export default BadRequestError;