import AggregatedUserService from '../services/AggregatedUserService.js';

class AggregatedUserController {

  // Méthode pour la page profile
  static async getAggregatedUserProfile(req, res) {
    // const { userId = null } = req.auth || {};

    const userId = 1;

    if (!userId) {
      return res.redirect('/signin');
    }

    const user = await AggregatedUserService.getAggregatedUserProfile(userId);
    console.log(JSON.stringify(user, null, 2));
    res.status(200).render('utilitaires/profile', {
      user,
    });
  }

}

export default AggregatedUserController;
