import { z } from 'zod';

const NotificationType = z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ORDER', 'PRODUCT', 'USER']);

// body params
export const createNotificationSchema = z.object({
  userIds: z.array(z.number().positive('L\'id doit être un nombre positif')).min(1, 'Au moins un userId est requis'),
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  message: z.string().min(1, 'Le message est requis').max(500, 'Le message ne peut pas dépasser 500 caractères'),
  type: NotificationType,
  data: z.record(z.any()).optional(),
});

// url params
export const notificationIdSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

// query params
export const getNotificationsSchema = z.object({
  limit: z.coerce.number().positive('limit doit être un nombre positif').default(10).optional(),
  offset: z.coerce.number().nonnegative('offset doit être un nombre positif ou zéro').default(0).optional(),
  unreadOnly: z.coerce.boolean().default(false).optional(),
});
