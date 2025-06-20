import { redisClient } from '../config/redis.js';

class PermissionsStore {
  static async setPermissions(userId, permissions) {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array');
    }

    await redisClient.set(`permissions:${userId}`, JSON.stringify(permissions));
  }

  static async addPermission(userId, newPerm) {
    const current = await this.getPermissions(userId);

    if (Array.isArray(current) && !current?.includes(newPerm)) {
      current.push(newPerm);
      await this.setPermissions(userId, current);
    }
  }

  static async removePermission(userId, permToRemove) {
    const current = await this.getPermissions(userId);

    if (Array.isArray(current)) {
      const updatedPermissions = current.filter(perm => perm !== permToRemove);
      await this.setPermissions(userId, updatedPermissions);
    }
  }

  static async getPermissions(userId) {
    const data = await redisClient.get(`permissions:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  static async clearUserCache(userId) {
    await redisClient.del(`permissions:${userId}`);
  }
}

export default PermissionsStore;
