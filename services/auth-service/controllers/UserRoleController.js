import RolesStore from "../../../shared/stores/RolesStore.js";
import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserRoleController {
  static async getUserRoles(req, res) {
    const { userId } = req.params;

    // Recuperer la liste des roles de l'utilisateur si il est isActive
    const userRoles = await prisma.userHasRole.findMany({
      where: {
        user: {
          isActive: true,
          id: userId,
        },
        role: {
          isActive: true,
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return res.status(200).json(userRoles);
  }

  static async assignRoleToUser(req, res) {
    const { userId, roleId } = req.body;

    const existingUserRole = await prisma.userHasRole.findFirst({
      where: { userId, roleId },
    });

    if (existingUserRole) {
      throw new BadRequestError('User already has this role.');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found.');
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new NotFoundError('Role not found.');
    }

    const newUserRole = await prisma.userHasRole.create({
      data: { userId, roleId },
    });

    await RolesStore.addRole(userId, existingRole.name);

    return res.status(201).json(newUserRole);
  }

  static async removeRoleFromUser(req, res) {
    const { userId, roleId } = req.params;

    const existingUserRole = await prisma.userHasRole.findFirst({
      where: { userId, roleId },
    });

    if (!existingUserRole) {
      throw new NotFoundError('User role not found.');
    }

    await prisma.userHasRole.delete({
      where: { id: existingUserRole.id },
    });

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    await RolesStore.removeRole(userId, role.name);

    return res.status(204).json({ message: 'Role removed from user successfully.' });
  }
}

export default UserRoleController;
