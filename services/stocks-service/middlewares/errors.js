import AppError from '../exceptions/AppError.js';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export default (err, _, res, next) => {

  //! Passer la main au gestionnaire d'erreurs d'Express si les en-têtes ont déjà été envoyés au client
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.error,
      message: err.message
    });
  }

  if (err instanceof ZodError) {

    const errorMessages = err.errors.map((issue) => ({
      message: `${issue.path.join('.')} is ${issue.message}`,
    }))

    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }

  // Erreur inconnue (non prévue)
  console.error(err);
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong'
  });

};
