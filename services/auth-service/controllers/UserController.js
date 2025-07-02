import UserService from '../services/UserService.js';

class UserController {
  static async getUsers(req, res) {
    const { limit, offset } = req.query;
    const users = await UserService.getUsers(limit, offset);
    return res.status(200).json(users);
  }

  static async getUserById(req, res) {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    return res.status(200).json(user);
  }

  static async createUser(req, res) {
    const { firstname, lastname, email, hashPassword, salt, isActive } = req.body;
    const newUser = await UserService.createUser({ firstname, lastname, email, hashPassword, salt, isActive });
    return res.status(201).json({
      message: 'User created successfully.',
      newUser,
    });
  }

  static async updateUserById(req, res) {
    const { id } = req.params;
    const { firstname, lastname, email, hashPassword, salt, isActive } = req.body;
    const updatedUser = await UserService.updateUserById(id, { firstname, lastname, email, hashPassword, salt, isActive });
    return res.status(200).json({
      message: 'User updated successfully.',
      updatedUser,
    });
  }

  static async deleteUserById(req, res) {
    const { id } = req.params;
    const deletedUser = await UserService.deleteUserById(id);
    return res.status(204).json({
      message: 'User deleted successfully.',
      deletedUser,
    });
  }
}

export default UserController;
