import AggregatedUserService from '../services/AggregatedUserService.js';

class AggregatedUserController {

  // Méthode pour la page profile
  static async getAggregatedUserProfile(req, res) {
    const { userId = null } = req.auth || {};

    if (!userId) {
      return res.render('communes/404');
    }

    const user = await AggregatedUserService.getAggregatedUserProfile(userId);
    // console.log(JSON.stringify(user, null, 2));
    res.status(200).render('utilitaires/profile', {
      user,
    });
  }

  // Methode pour la page admin crud user
  static async getAggregatedUsers(req, res) {
    const { userId = null } = req.auth || {};

    if (!userId) {
      return res.render('communes/404');
    }

    const { users, userCount } = await AggregatedUserService.getAggregatedUsers();
    console.log(JSON.stringify({ users, userCount }, null, 2));
    res.status(200).render('admin/users', {
      users,
      userCount,
    });
  }

}

export default AggregatedUserController;
