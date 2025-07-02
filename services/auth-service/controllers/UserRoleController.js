import UserRoleService from '../services/UserRoleService.js';

class UserRoleController {
  static async getUserRoles(req, res) {
    const { userId } = req.params;
    const userRoles = await UserRoleService.getUserRoles(userId);
    return res.status(200).json(userRoles);
  }

  static async assignRoleToUser(req, res) {
    const { userId, roleId } = req.body;
    const newUserRole = await UserRoleService.assignRoleToUser(userId, roleId);
    return res.status(201).json(newUserRole);
  }

  static async removeRoleFromUser(req, res) {
    const { userId, roleId } = req.params;
    const result = await UserRoleService.removeRoleFromUser(userId, roleId);
    return res.status(204).json(result);
  }
}

export default UserRoleController;
