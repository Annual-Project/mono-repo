class AppError extends Error {
  constructor(statusCode, error, message) {
      super(message);
      this.statusCode = statusCode;
      this.error = error;
  }
}

export default AppError;