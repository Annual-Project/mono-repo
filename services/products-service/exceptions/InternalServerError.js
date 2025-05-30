import AppError from './AppError';

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, 'INTERNAL_SERVER_ERROR', message);
  }
}

export default InternalServerError;