import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class RoleService {
  static async getRoles(limit, offset) {
    return await prisma.role.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getRoleById(id) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    return role;
  }

  static async createRole({ name, description }) {
    const existingRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingRole) {
      throw new BadRequestError('Role with this name already exists.');
    }

    return await prisma.role.create({
      data: { name, description },
    });
  }

  static async updateRoleById(id, { name, description }) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundError('Role not found.');
    }

    if (name !== existingRole.name) {
      const roleWithSameName = await prisma.role.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      if (roleWithSameName) {
        throw new BadRequestError('Role with this name already exists.');
      }
    }

    return await prisma.role.update({
      where: { id },
      data: { name, description },
    });
  }

  static async deleteRoleById(id) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundError('Role not found.');
    }

    const userRoleCount = await prisma.userHasRole.count({
      where: { roleId: id },
    });

    if (userRoleCount > 0) {
      throw new ForbiddenError('Cannot delete a role that is assigned to users.');
    }

    await prisma.role.delete({
      where: { id },
    });
  }
}

export default RoleService;
