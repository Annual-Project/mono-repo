import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class AggregatedUserService {

  // Méthode pour la page profile
  static async getAggregatedUserProfile(userId) {
    // Call en interne pour récupérer les informations de l'utilisateur
    const userResponse = await fetch(`http://auth_service:3000/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!userResponse.ok) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    const user = await userResponse.json();

    return user;
  }

  // Méthode pour la page admin crud user
  static async getAggregatedUsers() {
    // 1. Récupération de tous les utilisateurs
    const usersResponse = await fetch('http://auth_service:3000/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!usersResponse.ok) {
      throw new BadRequestError('Failed to fetch users');
    }
    const users = await usersResponse.json();

    // 6. Statistiques
    const userCount = users.length;

    return {
      users,
      userCount,
    };
  }

}

export default AggregatedUserService;
