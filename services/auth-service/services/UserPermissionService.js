import prisma from "../config/db.js";

import PermissionsStore from "../../../shared/stores/PermissionsStore.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserPermissionService {
  static async getUserPermissions(userId) {
    const userPermissions = await prisma.userHasPermission.findMany({
      where: {
        user: {
          isActive: true,
          id: userId,
        },
        permission: {
          isActive: true,
        },
      },
      include: {
        permission: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return userPermissions;
  }

  static async assignPermissionToUser(userId, permissionId) {
    const existingUserPermission = await prisma.userHasPermission.findFirst({
      where: { userId, permissionId },
    });

    if (existingUserPermission) {
      throw new BadRequestError('User already has this permission.');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found.');
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!existingPermission) {
      throw new NotFoundError('Permission not found.');
    }

    const newUserPermission = await prisma.userHasPermission.create({
      data: { userId, permissionId },
    });

    await PermissionsStore.addPermission(userId, existingPermission.name);

    return newUserPermission;
  }

  static async removePermissionFromUser(userId, permissionId) {
    const existingUserPermission = await prisma.userHasPermission.findFirst({
      where: { userId, permissionId },
    });

    if (!existingUserPermission) {
      throw new NotFoundError('User permission not found.');
    }

    await prisma.userHasPermission.delete({
      where: { id: existingUserPermission.id },
    });

    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundError('Permission not found.');
    }

    await PermissionsStore.removePermission(userId, permission.name);

    return { message: 'Permission removed from user successfully.' };
  }
}

export default UserPermissionService;
