import AuthProvider from "../providers/auth.js";
import prisma from "../config/db.js";

import UnauthorizedError from "../exceptions/UnauthorizedError.js";
import InvalidTokenError from "../exceptions/InvalidTokenError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";

/**
 * MW qui va vérifier si l'utilisateur possède un token d'accès valide et non expiré
 * @param {Request} req - Requête venant de l'utilisateur
 * @param {Response} _ - Réponse inutilisée
 * @param {NextFunction} next - Fonction pour passer au prochain MW
 */
export default async (req, _, next) => {

  const { accessTokenM, refreshTokenM } = req.cookies;
  req.auth = null;

  if (!accessTokenM || !refreshTokenM)
    return next(
      new UnauthorizedError('Access and refresh tokens are required'),
    );

  const goodAccessToken = AuthProvider.verifyAccessToken(accessTokenM, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if (!goodAccessToken)
    return next(
      new InvalidTokenError('Access'),
    );

  const goodRefreshToken = AuthProvider.verifyRefreshToken(refreshTokenM, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if (!goodRefreshToken)
    return next(
      new InvalidTokenError('Refresh'),
    );

  const user = await prisma.user.findUnique({
    where: {
      id: goodAccessToken.sub,
    },
  });

  if (!user)
    return next(
      new NotFoundError('User not found'),
    );

  if (user.accessToken !== accessTokenM || user.refreshToken !== refreshTokenM)
    return next(
      new ForbiddenError('Token mismatch with server records'),
    );

  req.auth = {
    userId: goodAccessToken.sub,
  };

  return next();

}