import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class PermissionController {
  static async getPermissions(_, res) {
    const permissions = await prisma.permission.findMany();

    return res.status(200).json(permissions);
  }

  static async getPermissionById(req, res) {
    const { id } = req.params;
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundError('Permission not found.');
    }

    return res.status(200).json(permission);
  }

  static async createPermission(req, res) {
    const { name, description } = req.body;

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

    const newPermission = await prisma.permission.create({
      data: { name, description },
    });

    return res.status(201).json(newPermission);
  }

  static async updatePermissionById(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

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

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: { name, description },
    });

    return res.status(200).json(updatedPermission);
  }

  static async deletePermissionById(req, res) {
    const { id } = req.params;

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
    
    return res.status(204).send();
  }
}

export default PermissionController;
