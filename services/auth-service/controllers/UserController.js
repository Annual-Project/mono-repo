import prisma from "../config/db.js";

import AuthProvider from "../providers/auth.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UserController {

  static async getUsers(_, res) {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
    });

    return res.status(200).json(users);
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return res.status(200).json(user);
  }

  static async createUser(req, res) {
    const { firstname, lastname, email, hashPassword, salt, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists.');
    }

    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashPassword,
        salt,
        isActive,
      },
    });

    return res.status(201).json({
      message: 'User created successfully.',
      newUser,
    });
  }

  static async updateUserById(req, res) {
    const { id } = req.params;
    const { firstname, lastname, email, hashPassword, salt, isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const updatedUser = await prisma.user.update({
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

    return res.status(200).json({
      message: 'User updated successfully.',
      updatedUser,
    });
  }

  static async deleteUserById(req, res) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const deletedUser = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return res.status(204).json({
      message: 'User deleted successfully.',
      deletedUser,
    });
  }

}

export default UserController;
