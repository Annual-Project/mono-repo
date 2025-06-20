import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class RoleController {
  static async getRoles(_, res) {
    const roles = await prisma.role.findMany();

    return res.status(200).json(roles);
  }

  static async getRoleById(req, res) {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    return res.status(200).json(role);
  }

  static async createRole(req, res) {
    const { name, description } = req.body;

    const existingRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Ignore case sensitivity
        },
      },
    });

    if (existingRole) {
      throw new BadRequestError('Role with this name already exists.');
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(newRole);
  }

  static async updateRoleById(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingRole = await prisma.role.findUnique({
      where: {
        id,
      },
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

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json(updatedRole);
  }

  static async deleteRoleById(req, res) {
    const { id } = req.params;

    const existingRole = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      throw new NotFoundError('Role not found.');
    }

    const userRoleCount = await prisma.userHasRole.count({
      where: {
        roleId: id,
      },
    });

    if (userRoleCount > 0) {
      throw new ForbiddenError('Cannot delete a role that is assigned to users.');
    }

    await prisma.role.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}

export default RoleController;
