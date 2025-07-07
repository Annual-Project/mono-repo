import prisma from "../config/db.js";

import { getSocketServer } from "../config/sockerServer.js";

import NotFoundError from '../exceptions/NotFoundError.js';
import InternalServerError from '../exceptions/InternalServerError.js';

class NotificationService {
  static #io = null;

  static async createNotification({ userIds, title, message, type, data }) {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        data,
        UserHasNotification: {
          create: userIds.map(userId => ({
            userId,
          })),
        },
      },
    });

    if (!notification) {
      throw new InternalServerError('Erreur lors de la création de la notification');
    }

    // Envoyer la notification via WebSocket à tous les destinataires
    this.#io = getSocketServer();
    userIds.forEach(userId => {
      const notificationForUser = {
        ...notification,
        recipient: notification.recipients?.find(r => r.userId === userId),
      };
      // this.#io.to(`user_${userId}`).emit('notification', notificationForUser);

      // Envoyer la notification à tous les utilisateurs
      this.#io.emit('notification', notificationForUser);
    });

    return notification;
  }

  static async getNotifications({ userId, limit, offset, unreadOnly }) {
    const where = {
      UserHasNotification: {
        some: {
          userId,
          ...(unreadOnly && { read: false }),
        },
      },
    };

    const notifications = await prisma.notification.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.notification.count({ where });

    return {
      notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + notifications.length < total,
      },
    };
  }

  static async markAsRead({ userId, notificationId }) {
    const notification = await prisma.userHasNotification.update({
      data: {
        read: true,
      },
      where: {
        notificationId,
        userId,
        read: false,
      },
    });

    if (!notification) {
      throw new NotFoundError('Notification non trouvée ou déjà lue');
    }

    return notification;
  }

  static async markAllAsRead(userId) {
    const notifications = await prisma.userHasNotification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return notifications;
  }

  static async deleteNotification(notificationId) {
    const deletedNotification = await prisma.notification.delete({
      where: { id: notificationId },
    });

    if (!deletedNotification) {
      throw new NotFoundError('Notification non trouvée');
    }

    return deletedNotification;
  }
}

export default NotificationService;
