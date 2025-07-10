import prisma from "../config/db.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserService {
  static async getUsers(limit, offset) {
    return await prisma.user.findMany({
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset,
    });
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    // Retirer un niveau d'imbrication pour simplifier l'objet roles
    user.roles = user.roles.map(({ role }) => role.name);

    return user;
  }

  static async getUsersByRole(roleName, limit, offset) {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        UserHasRole: {
          some: {
            role: {
              name: roleName,
              isActive: true,
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });

    return users;
  }

  static async createUser({ firstname, lastname, email, hashPassword, salt, isActive }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists.');
    }

    return await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashPassword,
        salt,
        isActive,
      },
    });
  }

  static async updateUserById(id, { firstname, lastname, email, hashPassword, salt, isActive }) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return await prisma.user.update({
      where: { id },
      data: {
        firstname,
        lastname,
        email,
        password: hashPassword,
        salt,
        isActive,
      },
    });
  }

  static async deleteUserById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export default UserService;
