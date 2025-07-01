import AuthService from "../../../shared/services/AuthService.js";

/**
 * MW qui va vérifier si l'utilisateur possède un token d'accès valide et non expiré
 * @param {Request} req - Requête venant de l'utilisateur
 * @param {Response} _ - Réponse inutilisée
 * @param {NextFunction} next - Fonction pour passer au prochain MW
 */
export default async (req, _, next) => {
  const { accessTokenM, refreshTokenM } = req.cookies;
  req.auth = null;

  if (!accessTokenM || !refreshTokenM) {
    return next(); // Laisser passer sans authentification
  }

  const goodAccessToken = AuthService.verifyAccessToken(accessTokenM, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if (!goodAccessToken) {
    return next(); // Laisser passer sans authentification
  }

  const goodRefreshToken = AuthService.verifyRefreshToken(refreshTokenM, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if (!goodRefreshToken) {
    return next(); // Laisser passer sans authentification
  }

  req.auth = {
    userId: goodAccessToken.sub,
  };

  return next();
};