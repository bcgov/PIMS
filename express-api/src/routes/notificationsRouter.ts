import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const DISPOSAL_API_ROUTE = '/projects/disposal';
export const NOTIFICATION_QUEUE_ROUTE = '/queue';
export const NOTIFICATION_TEMPLATE_ROUTE = '/templates';

const {
  getDisposalNotifications,
  filterDisposalNotifications,
  deleteNotificationTemplate,
  getNotificationInQueueById,
  getNotificationTemplate,
  filterNotificationsInQueue,
  updateNotificationInQueueById,
  resendNotificationInQueueById,
  cancelNotificationInQueueById,
  getAllNotificationTemplates,
  addNotificationTemplate,
  getNotificationsByProjectId,
  updateNotificationTemplate,
  sendNotificationsForTemplate,
} = controllers;

router
  .route(`${DISPOSAL_API_ROUTE}/:id`)
  .get(activeUserCheck, catchErrors(getDisposalNotifications));

router
  .route(`${DISPOSAL_API_ROUTE}`)
  .post(activeUserCheck, catchErrors(filterDisposalNotifications));

//This is implemented as PUT in the original implementation, but I'm not sure it makes sense considering you don't need to send an entire resource.
//The implementation only really looks at the ID in the query param. Surely a DELETE is more appropriate, could probably omit the 'cancel' verb altogether.
router
  .route(`${DISPOSAL_API_ROUTE}/:id`)
  .delete(activeUserCheck, catchErrors(deleteNotificationTemplate));
//I believe that the IDs used in these routes are actually the project ID, even though the structure here sort of implies
//that it might be an individual "notification id".
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}`)
  .get(activeUserCheck, catchErrors(getNotificationsByProjectId));
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/filter`)
  .post(activeUserCheck, catchErrors(filterNotificationsInQueue));
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id`)
  .get(activeUserCheck, catchErrors(getNotificationInQueueById))
  .put(activeUserCheck, catchErrors(updateNotificationInQueueById));

//These two are kind of iffy too. Again, could cancel not be delete?
//Less sure about resend. Is there any reason that the creation endpoint can't just be called again? That would be more RESTful IMO.
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id/resend`)
  .put(activeUserCheck, catchErrors(resendNotificationInQueueById));
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id`)
  .delete(activeUserCheck, catchErrors(cancelNotificationInQueueById));

//The ID here is the "template id", I think. The service implementation does not actually look at the param though, it just trusts the body.
router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}`)
  .get(activeUserCheck, catchErrors(getAllNotificationTemplates))
  .post(activeUserCheck, catchErrors(addNotificationTemplate));
router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}/:id`)
  .get(activeUserCheck, catchErrors(getNotificationTemplate))
  .put(activeUserCheck, catchErrors(updateNotificationTemplate))
  .delete(activeUserCheck, catchErrors(deleteNotificationTemplate));

router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}/:templateId/projects/:projectId`)
  .post(activeUserCheck, catchErrors(sendNotificationsForTemplate));

export default router;
