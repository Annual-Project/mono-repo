import PermissionService from '../services/PermissionService.js';

class PermissionController {
  static async getPermissions(req, res) {
    const { limit, offset } = req.query;
    const permissions = await PermissionService.getPermissions(limit, offset);
    return res.status(200).json(permissions);
  }

  static async getPermissionById(req, res) {
    const { id } = req.params;
    const permission = await PermissionService.getPermissionById(id);
    return res.status(200).json(permission);
  }

  static async createPermission(req, res) {
    const { name, description } = req.body;
    const newPermission = await PermissionService.createPermission({ name, description });
    return res.status(201).json(newPermission);
  }

  static async updatePermissionById(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedPermission = await PermissionService.updatePermissionById(id, { name, description });
    return res.status(200).json(updatedPermission);
  }

  static async deletePermissionById(req, res) {
    const { id } = req.params;
    const deletedPerm = await PermissionService.deletePermissionById(id);
    return res.status(204).json({
      message: 'Permission deleted successfully.',
      deletedPerm,
    });
  }
}

export default PermissionController;
