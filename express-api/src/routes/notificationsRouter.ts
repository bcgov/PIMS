import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import userAuthCheck from '@/middleware/userAuthCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const NOTIFICATION_QUEUE_ROUTE = '/queue';
export const NOTIFICATION_TEMPLATE_ROUTE = '/templates';

const { getNotificationsByProjectId, resendNotificationById, cancelNotificationById } = controllers;

//I believe that the IDs used in these routes are actually the project ID, even though the structure here sort of implies
//that it might be an individual "notification id".
router
  .route(NOTIFICATION_QUEUE_ROUTE)
  .get(userAuthCheck(), catchErrors(getNotificationsByProjectId));

router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id`)
  .put(userAuthCheck({ requiredRoles: [Roles.ADMIN] }), catchErrors(resendNotificationById))
  .delete(userAuthCheck({ requiredRoles: [Roles.ADMIN] }), catchErrors(cancelNotificationById));

export default router;
