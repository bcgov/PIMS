import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const DISPOSAL_API_ROUTE = '/projects/disposal/';
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
  getNotificationsInQueue,
  updateNotificationTemplate,
  sendNotificationsForTemplate,
} = controllers;

router.route(`${DISPOSAL_API_ROUTE}/:id`).get(catchErrors(getDisposalNotifications));
router.route(`${DISPOSAL_API_ROUTE}`).post(catchErrors(filterDisposalNotifications));

//This is implemented as PUT in the original implementation, but I'm not sure it makes sense considering you don't need to send an entire resource.
//The implementation only really looks at the ID in the query param. Surely a DELETE is more appropriate, could probably omit the 'cancel' verb altogether.
router.route(`${DISPOSAL_API_ROUTE}/:id`).delete(catchErrors(deleteNotificationTemplate));

//I believe that the IDs used in these routes are actually the project ID, even though the structure here sort of implies
//that it might be an individual "notification id".
router.route(`${NOTIFICATION_QUEUE_ROUTE}`).get(catchErrors(getNotificationsInQueue));
router.route(`${NOTIFICATION_QUEUE_ROUTE}/filter`).post(catchErrors(filterNotificationsInQueue));
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id`)
  .get(catchErrors(getNotificationInQueueById))
  .put(catchErrors(updateNotificationInQueueById));

//These two are kind of iffy too. Again, could cancel not be delete?
//Less sure about resend. Is there any reason that the creation endpoint can't just be called again? That would be more RESTful IMO.
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id/resend`)
  .put(catchErrors(resendNotificationInQueueById));
router.route(`${NOTIFICATION_QUEUE_ROUTE}/:id`).delete(catchErrors(cancelNotificationInQueueById));

//The ID here is the "template id", I think. The service implementation does not actually look at the param though, it just trusts the body.
router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}`)
  .get(catchErrors(getAllNotificationTemplates))
  .post(catchErrors(addNotificationTemplate));
router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}/:id`)
  .get(catchErrors(getNotificationTemplate))
  .put(catchErrors(updateNotificationTemplate))
  .delete(catchErrors(deleteNotificationTemplate));

router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}/:templateId/projects/:projectId`)
  .post(catchErrors(sendNotificationsForTemplate));

export default router;
