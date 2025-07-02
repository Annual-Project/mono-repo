import UserPermissionService from '../services/UserPermissionService.js';

class UserPermissionController {
  static async getUserPermissions(req, res) {
    const { userId } = req.params;
    const userPermissions = await UserPermissionService.getUserPermissions(userId);
    return res.status(200).json(userPermissions);
  }

  static async assignPermissionToUser(req, res) {
    const { userId, permissionId } = req.body;
    const newUserPermission = await UserPermissionService.assignPermissionToUser(userId, permissionId);
    return res.status(201).json(newUserPermission);
  }

  static async removePermissionFromUser(req, res) {
    const { userId, permissionId } = req.params;
    const result = await UserPermissionService.removePermissionFromUser(userId, permissionId);
    return res.status(204).json(result);
  }
}

export default UserPermissionController;
