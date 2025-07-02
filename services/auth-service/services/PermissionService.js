import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class PermissionService {
  static async getPermissions(limit, offset) {
    return await prisma.permission.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getPermissionById(id) {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundError('Permission not found.');
    }

    return permission;
  }

  static async createPermission({ name, description }) {
    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingPermission) {
      throw new BadRequestError('Permission with this name already exists.');
    }

    return await prisma.permission.create({
      data: { name, description },
    });
  }

  static async updatePermissionById(id, { name, description }) {
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundError('Permission not found.');
    }

    if (name !== existingPermission.name) {
      const permissionWithSameName = await prisma.permission.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      if (permissionWithSameName) {
        throw new BadRequestError('Permission with this name already exists.');
      }
    }

    return await prisma.permission.update({
      where: { id },
      data: { name, description },
    });
  }

  static async deletePermissionById(id) {
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundError('Permission not found.');
    }

    const userPermissionCount = await prisma.userHasPermission.count({
      where: { permissionId: id },
    });

    if (userPermissionCount > 0) {
      throw new ForbiddenError('Cannot delete a permission that is assigned to users.');
    }

    await prisma.permission.delete({ where: { id } });
  }
}

export default PermissionService;
