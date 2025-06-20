import PermissionsStore from "../../../shared/stores/PermissionsStore.js";
import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserPermissionController {
  static async getUserPermissions(req, res) {
    const { userId } = req.params;

    // Recuperer la liste des permissions de l'utilisateur si il est isActive
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

    return res.status(200).json(userPermissions);
  }

  static async assignPermissionToUser(req, res) {
    const { userId, permissionId } = req.body;

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

    return res.status(201).json(newUserPermission);
  }

  static async removePermissionFromUser(req, res) {
    const { userId, permissionId } = req.params;

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

    return res.status(204).json({ message: 'Permission removed from user successfully.' });
  }
}

export default UserPermissionController;
