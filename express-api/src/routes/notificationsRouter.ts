import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const DISPOSAL_API_ROUTE = '/projects/disposal';
export const NOTIFICATION_QUEUE_ROUTE = '/queue';
export const NOTIFICATION_TEMPLATE_ROUTE = '/templates';

const { getNotificationsByProjectId } = controllers;

//I believe that the IDs used in these routes are actually the project ID, even though the structure here sort of implies
//that it might be an individual "notification id".
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}`)
  .get(activeUserCheck, catchErrors(getNotificationsByProjectId));

export default router;
