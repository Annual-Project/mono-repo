import AppError from '../exceptions/AppError.js';

const errorHandler = (controllerFn) => {
  return async (req, res) => {
    try {
      await controllerFn(req, res);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.error,
          message: error.message
        });
      }

      // Erreur inconnue (non prévue)
      console.error(error);
      res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong'
      });
    }
  };
};

export default errorHandler;