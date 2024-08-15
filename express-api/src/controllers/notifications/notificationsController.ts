import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import userServices from '@/services/users/usersServices';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Request, Response } from 'express';
import { DisposalNotificationFilterSchema } from './notificationsSchema';
import { isAdmin, isAuditor } from '@/utilities/authorizationChecks';
import projectServices from '@/services/projects/projectsServices';
import { Roles } from '@/constants/roles';

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
    const kcUser = req.user as unknown as SSOUser;
    const user = await userServices.getUser((req.user as SSOUser).preferred_username);

    if (!(isAdmin(kcUser) || isAuditor(kcUser))) {
      // get array of user's agencies
      const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);

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
    // not sure if the error codes can be handled better here?
    return res.status(500).send({ message: 'Error fetching notifications' });
  }
};

export const resendNotificationById = async (req: Request, res: Response) => {
  const kcUser = req.user;
  if (!kcUser.hasRoles([Roles.ADMIN]))
    return res.status(403).send('User lacks permissions to resend notification.');
  const id = Number(req.params.id);
  const notification = await notificationServices.getNotificationById(id);
  if (!notification) {
    return res.status(404).send('Notification not found.');
  }
  const resultantNotification = await notificationServices.sendNotification(notification, kcUser);
  const user = await userServices.getUser(kcUser.preferred_username);
  const updatedNotification = await notificationServices.updateNotificationStatus(
    resultantNotification.Id,
    user,
  );
  return res.status(200).send(updatedNotification);
};

export const cancelNotificationById = async (req: Request, res: Response) => {
  const kcUser = req.user;
  if (!kcUser.hasRoles([Roles.ADMIN]))
    return res.status(403).send('User lacks permissions to cancel notification.');
  const id = Number(req.params.id);
  const notification = await notificationServices.getNotificationById(id);
  if (!notification) {
    return res.status(404).send('Notification not found.');
  }
  const user = await userServices.getUser(kcUser.preferred_username);
  const resultantNotification = await notificationServices.cancelNotificationById(
    notification.Id,
    user,
  );
  if (resultantNotification.Status !== NotificationStatus.Cancelled) {
    return res.status(400).send(resultantNotification);
  }
  return res.status(200).send(resultantNotification);
};
