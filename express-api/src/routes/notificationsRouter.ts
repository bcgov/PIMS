import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

export const DISPOSAL_API_ROUTE = '/projects/disposal/';
export const NOTIFICATION_QUEUE_ROUTE = '/notifications/queue';
export const NOTIFICATION_TEMPLATE_ROUTE = 'notifications/templates';

router.route(`${DISPOSAL_API_ROUTE}/:id/notifications`).get(controllers.getDisposalNotifications);
router.route(`${DISPOSAL_API_ROUTE}/notifications`).post(controllers.filterDisposalNotifications);

//This is implemented as PUT in the original implementation, but I'm not sure it makes sense considering you don't need to send an entire resource.
//The implementation only really looks at the ID in the query param. Surely a DELETE is more appropriate, could probably omit the 'cancel' verb altogether.
router
  .route(`${DISPOSAL_API_ROUTE}/:id/notifications`)
  .delete(controllers.deleteNotificationTemplate);

//I believe that the IDs used in these routes are actually the project ID, even though the structure here sort of implies
//that it might be an individual "notification id".
router.route(`${NOTIFICATION_QUEUE_ROUTE}`).get(controllers.getNotificationsInQueue);
router.route(`${NOTIFICATION_QUEUE_ROUTE}/filter`).post(controllers.filterNotificationsInQueue);
router.route(`${NOTIFICATION_QUEUE_ROUTE}/:id`).get(controllers.getNotificationInQueueById);
router.route(`${NOTIFICATION_QUEUE_ROUTE}/:id`).put(controllers.updateNotificationInQueueById);

//These two are kind of iffy too. Again, could cancel not be delete?
//Less sure about resend. Is there any reason that the creation endpoint can't just be called again? That would be more RESTful IMO.
router
  .route(`${NOTIFICATION_QUEUE_ROUTE}/:id/resend`)
  .put(controllers.resendNotificationInQueueById);
router.route(`${NOTIFICATION_QUEUE_ROUTE}/:id`).delete(controllers.cancelNotificationInQueueById);

//The ID here is the "template id", I think. The service implementation does not actually look at the param though, it just trusts the body.
router.route(`${NOTIFICATION_TEMPLATE_ROUTE}`).get(controllers.getAllNotificationTemplates);
router.route(`${NOTIFICATION_TEMPLATE_ROUTE}/:id`).get(controllers.getNotificationTemplate);
router.route(`${NOTIFICATION_TEMPLATE_ROUTE}/:id`).put(controllers.updateNotificationTemplate);
router.route(`${NOTIFICATION_TEMPLATE_ROUTE}/:id`).delete(controllers.deleteNotificationTemplate);
router.route(`${NOTIFICATION_TEMPLATE_ROUTE}`).post(controllers.addNotificationTemplate);

router
  .route(`${NOTIFICATION_TEMPLATE_ROUTE}/:templateId/projects/:projectId`)
  .post(controllers.sendNotificationsForTemplate);

export default router;
