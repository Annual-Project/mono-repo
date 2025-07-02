import prisma from "../config/db.js";

import RolesStore from "../../../shared/stores/RolesStore.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserRoleService {
  static async getUserRoles(userId) {
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

    return userRoles;
  }

  static async assignRoleToUser(userId, roleId) {
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

    return newUserRole;
  }

  static async removeRoleFromUser(userId, roleId) {
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

    return { message: 'Role removed from user successfully.' };
  }
}

export default UserRoleService;
