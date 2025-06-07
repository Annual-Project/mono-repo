import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware de validation des données avec Zod
 * @param {Object} schema - Le schéma Zod à utiliser pour la validation
 * @param {string} source - La source des données à valider ('params', 'body', 'query')
 */
const validateData = (schema, source) => {
  return (req, res, next) => {
    try {
      // Vérifie si la source est valide
      if (!['params', 'body', 'query'].includes(source)) {
        throw new Error(`Source invalide pour la validation: ${source}`);
      }

      // Valide les données en fonction de la source
      const data = req[source];

      console.log(`Validation des données pour ${source}:`, data);

      // Lance une erreur si les données sont manquantes (ZodError)
      const validatedData = schema.parse(data);

      // Ajoute les données validées à la requête
      req[source] = validatedData;

      console.log(`Données validées pour ${source}:`, validatedData);

      next();
    } catch (error) {
      if (error instanceof ZodError) {

        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))

        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      }
    }
  };
};

export default validateData;
