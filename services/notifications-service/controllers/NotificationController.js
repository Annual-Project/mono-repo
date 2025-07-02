import NotificationService from '../services/NotificationService.js';

class NotificationController {
  static async createNotification(req, res) {
    const notification = await NotificationService.createNotification(req.body);
    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification créée avec succès',
    });
  }

  static async getNotifications(req, res) {
    const { userId = null } = req.auth || {};
    const { limit, offset, unreadOnly } = req.query;

    const { notifications, pagination } = await NotificationService.getNotifications({
      userId,
      limit,
      offset,
      unreadOnly,
    });

    res.json({
      success: true,
      data: notifications,
      pagination,
    });
  }

  static async markAsRead(req, res) {
    const { userId = null } = req.auth || {};
    const { notificationId } = req.params;

    const notification = await NotificationService.markAsRead({ userId, notificationId });

    res.json({
      success: true,
      data: notification,
      message: 'Notification marquée comme lue',
    });
  }

  static async markAllAsRead(req, res) {
    const { userId = null } = req.auth || {};

    const notifications = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: notifications,
      message: `${notifications.count} notifications marquées comme lues`,
    });
  }

  static async deleteNotification(req, res) {
    const { notificationId } = req.params;

    const deletedNotification = await NotificationService.deleteNotification(notificationId);

    res.json({
      success: true,
      message: 'Notification supprimée',
    });
  }
}

export default NotificationController;
