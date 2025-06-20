import { redisClient } from '../config/redis.js';

class RolesStore {
  static async setRoles(userId, roles) {
    if (!Array.isArray(roles)) {
      throw new Error('Roles must be an array');
    }

    await redisClient.set(`roles:${userId}`, JSON.stringify(roles));
  }

  static async addRole(userId, newRole) {
    const current = await this.getRoles(userId);

    if (Array.isArray(current) && !current?.includes(newRole)) {
      current.push(newRole);
      await this.setRoles(userId, current);
    }
  }

  static async removeRole(userId, roleToRemove) {
    const current = await this.getRoles(userId);

    if (Array.isArray(current)) {
      const updatedRoles = current.filter(role => role !== roleToRemove);
      await this.setRoles(userId, updatedRoles);
    }
  }

  static async getRoles(userId) {
    const data = await redisClient.get(`roles:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  static async clearUserCache(userId) {
    await redisClient.del(`roles:${userId}`);
  }
}

export default RolesStore;
