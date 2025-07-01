import { Router } from 'express';

import NotificationController from '../controllers/notificationController.js';

// Import des schémas de validation
import {
  createNotificationSchema,
  getNotificationsSchema,
  notificationIdSchema,
} from '../validations/notificationValidation.js';

// OTHER
import validateData from '../middlewares/validations.js';
import authorization from "../middlewares/authorization.js";

import controllerHandler from '../handlers/controllers.js';

import NotFoundError from '../exceptions/NotFoundError.js';

const router = Router();

// Routes pour les appels internes (depuis d'autres microservices)
router.post(
  '/api/v1/notifications',
  validateData(createNotificationSchema, "body"),
  controllerHandler(NotificationController.createNotification),
);

// Routes pour le client (lecture seule principalement)
// router.get(
//   '/',
//   validateQuery(getNotificationsSchema),
//   notificationController.getNotifications
// );

router.get(
  '/api/v1/notifications',
  authorization([], ["user"]),
  validateData(getNotificationsSchema, "query"),
  controllerHandler(NotificationController.getNotifications),
);

router.put(
  '/api/v1/notifications/:id/read',
  authorization([], ["user"]),
  validateData(notificationIdSchema, "params"),
  controllerHandler(NotificationController.markAsRead),
);

router.put(
  '/api/v1/notifications/mark-all-read',
  authorization([], ["user"]),
  controllerHandler(NotificationController.markAllAsRead),
);

router.delete(
  '/api/v1/notifications/:id',
  authorization([], ["user"]),
  validateData(notificationIdSchema, "params"),
  controllerHandler(NotificationController.deleteNotification),
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(
    new NotFoundError('Resource not found'),
  );
});

export default router;
