import prisma from "../config/db.js";

import { getSocketServer } from "../config/sockerServer.js";

import NotFoundError from '../exceptions/NotFoundError.js';
import InternalServerError from '../exceptions/InternalServerError.js';

class NotificationController {
  static #io = null;

  // Créer une notification
  static async createNotification(req, res) {
      const { userIds, title, message, type, data } = req.body;

      // Créer la notification
      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          type,
          data,
          UserHasNotification: {
            create: userIds.map(userId => ({
              userId: parseInt(userId),
            })),
          }
        }
      });

      if (!notification) {
        throw new InternalServerError('Erreur lors de la création de la notification');
      }

      // Envoyer la notification via WebSocket à tous les destinataires
      this.#io = getSocketServer();
      userIds.forEach(userId => {
        const notificationForUser = {
          ...notification,
          recipient: notification.recipients.find(r => r.userId === parseInt(userId)),
        };
        this.#io.to(`user_${userId}`).emit('notification', notificationForUser);
      });

      res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification créée avec succès',
      });
  }

  // Récupérer les notifications d'un utilisateur
  static async getNotifications(req, res) {
      const { userId = null } = req.auth || {};
      const { limit, offset, unreadOnly } = req.query;

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

      res.json({
        success: true,
        data: notifications,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + notifications.length < total,
        },
      });
  }

  // Marquer une notification comme lue
  static async markAsRead(req, res) {
      const { userId = null } = req.auth || {};
      const { notificationId } = req.params;

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

      res.json({
        success: true,
        data: notification,
        message: 'Notification marquée comme lue',
      });
  }

  // Marquer toutes les notifications d'un utilisateur comme lues
  static async markAllAsRead(req, res) {
      const { userId = null } = req.auth || {};

      const notifications = await prisma.userHasNotification.updateMany({
        where: { 
          userId,
          read: false,
        },
        data: { 
          read: true,
        },
      });

      res.json({
        success: true,
        data: notifications,
        message: `${notifications.count} notifications marquées comme lues`,
      });
  }

  // Supprimer une notification (pour un utilisateur spécifique)
  static async deleteNotification(req, res) {
      const { notificationId } = req.params;

      const deletedNotification = await prisma.notification.delete({
        where: { id: notificationId },
      });

      if (!deletedNotification) {
        throw new NotFoundError('Notification non trouvée');
      }

      res.json({
        success: true,
        message: 'Notification supprimée',
      });
  }
}

export default NotificationController;
