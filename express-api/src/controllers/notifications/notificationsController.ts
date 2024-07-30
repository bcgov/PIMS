import notificationServices from '@/services/notifications/notificationServices';
import userServices from '@/services/users/usersServices';
import { stubResponse } from '@/utilities/stubResponse';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Request, Response } from 'express';
import { DisposalNotificationFilterSchema } from './notificationsSchema';
import { isAdmin, isAuditor } from '@/utilities/authorizationChecks';
import projectServices from '@/services/projects/projectsServices';

/**
 * @description Get the notifications for the specified project filter based on query parameters.
 *  This will also update the status of all notifications that have not failed or been completed.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing notifications.
 */
export const getDisposalNotifications = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Notifications']
   * #swagger.description = 'Get the notifications for the specified project filter based on query parameters. This will also update the status of all notifications that have not failed or been completed.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Filter disposal notifications based on request body.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing filtered notifications.
 */
export const filterDisposalNotifications = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Get the notifications for the specified project based on the specified 'filter'. This will also update the status of all notifications that have not failed or been completed.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Cancel disposal notification.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the cancelled notification.
 */
export const cancelDisposalNotification = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Make a request to cancel any notifications in the queue that haven't been sent yet. Note - The queue may not immediately cancel the notification, and the response may indicate it is still Pending.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Get notifications in the queue.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing notifications in the queue.
 */
export const getNotificationsInQueue = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Get notifications in the queue.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Filter notifications in the queue based on request body.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing filtered notifications in the queue.
 */
export const filterNotificationsInQueue = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Filter notifications in the queue based on request body.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Get a notification in the queue by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing the specified notification in the queue.
 */
export const getNotificationInQueueById = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Get a notification in the queue by ID.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

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
        return res.status(403).send({ message: 'User is not authorized to access this endpoint.' });
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

export const updateNotificationInQueueById = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Update a notification in the queue by ID.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Resend a notification in the queue by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested ID.
 */
export const resendNotificationInQueueById = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Resend a notification in the queue by ID.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Cancel a notification in the queue by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the cancelled notification.
 */
export const cancelNotificationInQueueById = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Cancel a notification in the queue by ID.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Get all notification templates.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an an array of notification templates.
 */
export const getAllNotificationTemplates = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Get all notification templates.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Get a notification template.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status the template.
 */
export const getNotificationTemplate = async (req: Request, res: Response) => {
  /**
         * #swagger.tags = ['Notifications']
         * #swagger.description = 'Get a notification template.'
         * #swagger.security = [{
            "bearerAuth" : []
            }]
         */
  return stubResponse(res);
};

/**
 * @description Update notification template.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status the updated template.
 */
export const updateNotificationTemplate = async (req: Request, res: Response) => {
  /**
       * #swagger.tags = ['Notifications']
       * #swagger.description = 'Update a notification template.'
       * #swagger.security = [{
          "bearerAuth" : []
          }]
       */
  return stubResponse(res);
};

/**
 * @description Add a notification template.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 201 status with an object containing the new template.
 */
export const addNotificationTemplate = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Add a notification template.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Delete a notification template.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the deleted template.
 */
export const deleteNotificationTemplate = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Delete a notification template.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Send notifications based on a template.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 201 status with the notification we sent.
 */
export const sendNotificationsForTemplate = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Notifications']
     * #swagger.description = 'Send an email for the specified notification template 'templateId' to the specified list of email addresses in 'to'.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};
