import { Router } from 'express';

import NotificationController from '../controllers/NotificationController.js';

// Import des schémas de validation
import {
  createNotificationSchema,
  getNotificationsSchema,
  notificationIdSchema,
} from '../validations/notificationValidation.js';

// OTHER
import validationsMiddleware from '../middlewares/validationsMiddleware.js';
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";

import controllersHandler from '../handlers/controllersHandler.js';

import NotFoundError from '../exceptions/NotFoundError.js';

const router = Router();

// Routes pour les appels internes (depuis d'autres microservices)
router.post(
  '/api/v1/notifications',
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createNotificationSchema, "body"),
  controllersHandler(NotificationController.createNotification),
);

// Routes pour le client (lecture seule principalement)
// router.get(
//   '/',
//   validateQuery(getNotificationsSchema),
//   notificationController.getNotifications
// );

router.get(
  '/api/v1/notifications',
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getNotificationsSchema, "query"),
  controllersHandler(NotificationController.getNotifications),
);

router.put(
  '/api/v1/notifications/:id/read',
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(notificationIdSchema, "params"),
  controllersHandler(NotificationController.markAsRead),
);

router.put(
  '/api/v1/notifications/mark-all-read',
  authorizationMiddleware([], ["user"]),
  controllersHandler(NotificationController.markAllAsRead),
);

router.delete(
  '/api/v1/notifications/:id',
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(notificationIdSchema, "params"),
  controllersHandler(NotificationController.deleteNotification),
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(
    new NotFoundError('Resource not found'),
  );
});

export default router;
