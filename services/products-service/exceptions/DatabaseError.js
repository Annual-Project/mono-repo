import AppError from './AppError';

class DatabaseError extends AppError {
  constructor(message = 'Database error') {
    super(500, 'DATABASE_ERROR', message);
  }
}

export default DatabaseError;