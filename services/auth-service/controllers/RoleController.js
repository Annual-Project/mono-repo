import RoleService from '../services/RoleService.js';

class RoleController {
  static async getRoles(req, res) {
    const { limit, offset } = req.query;
    const roles = await RoleService.getRoles(limit, offset);
    return res.status(200).json(roles);
  }

  static async getRoleById(req, res) {
    const { id } = req.params;
    const role = await RoleService.getRoleById(id);
    return res.status(200).json(role);
  }

  static async createRole(req, res) {
    const { name, description } = req.body;
    const newRole = await RoleService.createRole({ name, description });
    return res.status(201).json(newRole);
  }

  static async updateRoleById(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedRole = await RoleService.updateRoleById(id, { name, description });
    return res.status(200).json(updatedRole);
  }

  static async deleteRoleById(req, res) {
    const { id } = req.params;
    const deletedRole = await RoleService.deleteRoleById(id);
    return res.status(204).json({
      message: 'Role deleted successfully.',
      deletedRole,
    });
  }
}

export default RoleController;
