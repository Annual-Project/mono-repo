import AppError from '../exceptions/AppError.js';
// import { StatusCodes } from 'http-status-codes';

export default (err, _, res, next) => {

  //! Passer la main au gestionnaire d'erreurs d'Express si les en-têtes ont déjà été envoyés au client
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(404).render('communes/404');
  }

  // Erreur inconnue (non prévue)
  console.error(err);
  return res.render('communes/404');

};
