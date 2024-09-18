import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import userServices from '@/services/users/usersServices';
import { Request, Response } from 'express';
import { DisposalNotificationFilterSchema } from './notificationsSchema';
import projectServices from '@/services/projects/projectsServices';
import { Roles } from '@/constants/roles';
import logger from '@/utilities/winstonLogger';

/**
 * @description Get all notifications for a specific project.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing the specified notifications in the queue.
 */
export const getNotificationsByProjectId = async (req: Request, res: Response) => {
  try {
    const filter = DisposalNotificationFilterSchema.safeParse(req.query);
    if (!filter.success) {
      return res.status(400).send({ message: 'Could not parse filter.' });
    }
    const filterResult = filter.data;
    const user = req.pimsUser;

    if (!user.hasOneOfRoles([Roles.ADMIN, Roles.AUDITOR])) {
      // get array of user's agencies
      const usersAgencies = await userServices.getAgencies(user.Username);

      const project = await projectServices.getProjectById(filterResult.projectId);
      if (!usersAgencies.includes(project.AgencyId)) {
        return res
          .status(403)
          .send({ message: 'User cannot access project outside their agencies.' });
      }
    }

    // Fetch notifications in the queue for this project
    const notificationsResult = await notificationServices.getProjectNotificationsInQueue(
      {
        projectId: filterResult.projectId,
        page: filterResult.page ?? 0,
        pageSize: filterResult.quantity ?? 0,
      },
      user,
    );

    return res.status(200).send(notificationsResult);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    return res.status(500).send({ message: 'Error fetching notifications' });
  }
};

export const resendNotificationById = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  if (!user.hasOneOfRoles([Roles.ADMIN]))
    return res.status(403).send('User lacks permissions to resend notification.');
  const id = Number(req.params.id);
  const notification = await notificationServices.getNotificationById(id);
  if (!notification) {
    return res.status(404).send('Notification not found.');
  }
  const resultantNotification = await notificationServices.sendNotification(notification, user);
  const updatedNotification = await notificationServices.updateNotificationStatus(
    resultantNotification.Id,
    user,
  );
  return res.status(200).send(updatedNotification);
};

export const cancelNotificationById = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  if (!user.hasOneOfRoles([Roles.ADMIN]))
    return res.status(403).send('User lacks permissions to cancel notification.');
  const id = Number(req.params.id);
  const notification = await notificationServices.getNotificationById(id);
  if (!notification) {
    return res.status(404).send('Notification not found.');
  }
  const resultantNotification = await notificationServices.cancelNotificationById(
    notification.Id,
    user,
  );
  if (resultantNotification.Status !== NotificationStatus.Cancelled) {
    return res.status(400).send(resultantNotification);
  }
  return res.status(200).send(resultantNotification);
};
