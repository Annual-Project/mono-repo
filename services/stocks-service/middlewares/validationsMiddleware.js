/**
 * Middleware de validation des données avec Zod
 * @param {Object} schema - Le schéma Zod à utiliser pour la validation
 * @param {string} source - La source des données à valider ('params', 'body', 'query')
 */
export default (schema, source) => {
  return (req, _, next) => {
    try {
      // Vérifie si la source est valide
      if (!['params', 'body', 'query'].includes(source)) {
        throw new Error(`Source invalide pour la validation: ${source}`);
      }

      // Valide les données en fonction de la source
      const data = { ...req[source] };

      console.log(`Validation des données pour ${source}:`, data);

      // Lance une erreur si les données sont manquantes (ZodError)
      const validatedData = schema.parse(data);

      // Ajoute les données validées à la requête
      // Au lieu de : req[source] = validatedData;
      if (!req.validated) req.validated = {};
      req.validated[source] = validatedData;

      console.log(`Données validées pour ${source}:`, validatedData);

      next();
    } catch (err) {
      next(err);
    }
  };
};
