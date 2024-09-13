import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { User } from '@/typeorm/Entities/User';
import { UUID, randomUUID } from 'crypto';
import nunjucks from 'nunjucks';
import { In, IsNull, MoreThan, QueryRunner } from 'typeorm';
import chesServices, {
  EmailBody,
  EmailEncoding,
  EmailPriority,
  IChesStatusResponse,
  IEmail,
} from '../ches/chesServices';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import logger from '@/utilities/winstonLogger';
import getConfig from '@/constants/config';
import { getDaysBetween } from '@/utilities/helperFunctions';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { PimsRequestUser } from '@/middleware/activeUserCheck';

export interface AccessRequestData {
  FirstName: string;
  LastName: string;
}

export enum NotificationStatus {
  Accepted = 0,
  Pending = 1,
  Cancelled = 2,
  Failed = 3,
  Completed = 4,
  NotFound = 5,
}

export enum NotificationAudience {
  ProjectOwner = 'ProjectOwner',
  OwningAgency = 'OwningAgency',
  Agencies = 'Agencies',
  ParentAgencies = 'ParentAgencies',
  Default = 'Default',
  WatchingAgencies = 'WatchingAgencies',
}

export enum AgencyResponseType {
  Unsubscribe = 0,
  Subscribe = 1,
  Watch = 2,
}
export interface ProjectNotificationFilter {
  projectId: number;
  page?: number;
  pageSize?: number;
}
export interface NotificationQueueModel {
  id: number;
  chesMessageId?: string;
  status: string;
  sendOn: Date;
  to: string;
  subject: string;
}
export interface PageModel<T> {
  items: T[];
  page: number;
  pageSize: number;
}

const config = getConfig();
const Title = config.notificationTemplate.title;
const Uri = config.notificationTemplate.uri;

/**
 * Flattens the project properties by mapping each project property to a flattened object.
 * @param project - The project object whose properties need to be flattened.
 * @returns The project object with flattened properties under the 'Properties' field.
 */
const flattenProjectProperties = (project: Project) => {
  const flattenedProperties = project.ProjectProperties.map((projectProperty) => {
    if (projectProperty.Building != null) {
      return {
        ...projectProperty.Building,
        Type: 'Building',
      };
    } else {
      return {
        ...projectProperty.Parcel,
        Type: 'Parcel',
      };
    }
  });
  return {
    ...project,
    Properties: flattenedProperties,
  };
};

/**
 * Generates a notification queue object for an access request.
 * @param accessRequest - Data for the access request containing FirstName and LastName.
 * @param templateId - The ID of the notification template to be used.
 * @param to - Optional recipient email address. If not provided, uses the default address from the template.
 * @returns A Promise that resolves to the created NotificationQueue object.
 */
const generateAccessRequestNotification = async (
  accessRequest: AccessRequestData,
  templateId: number,
  to?: string,
): Promise<NotificationQueue> => {
  const systemUser = await AppDataSource.getRepository(User).findOne({
    where: { Username: 'system' },
  });
  const template = await AppDataSource.getRepository(NotificationTemplate).findOne({
    where: { Id: templateId },
  });
  const body = nunjucks.renderString(template.Body, {
    Title: Title,
    Uri: Uri,
    AccessRequest: accessRequest,
  });
  const queueObject = {
    Key: randomUUID(), // The .NET backend seems to just generate this in the API. Not sure what purpose this serves when there's also a serialized int id.
    Status: NotificationStatus.Pending,
    Priority: template.Priority,
    Encoding: template.Encoding,
    SendOn: new Date(),
    Subject: template.Subject,
    BodyType: template.BodyType,
    To: to ?? template.To,
    Cc: template.Cc,
    Bcc: template.Bcc,
    Body: body,
    TemplateId: template.Id,
    CreatedById: systemUser.Id,
  };
  return AppDataSource.getRepository(NotificationQueue).save(queueObject);
};

/**
 * Inserts a new notification into the queue based on the provided template, project status notification, project, and optional agency.
 * If an override email is provided, it will be used instead of the agency's email.
 * Renders the notification content using Nunjucks templates and saves the notification in the database.
 * @param template The notification template to use for the notification.
 * @param projStatusNotif The project status notification triggering this notification.
 * @param project The project associated with the notification.
 * @param agency The agency to receive the notification (optional).
 * @param overrideTo An override email address to send the notification to (optional).
 * @param queryRunner The TypeORM query runner to use for the database transaction (optional).
 * @returns The inserted notification object.
 */
const insertProjectNotificationQueue = async (
  template: NotificationTemplate,
  projStatusNotif: ProjectStatusNotification,
  project: Project,
  agency?: Agency,
  overrideTo?: string,
  overrideSend?: Date,
  queryRunner?: QueryRunner,
) => {
  const query = queryRunner ?? AppDataSource.createQueryRunner();
  let emailSendDate = overrideSend;
  if (emailSendDate == undefined) {
    const sendDelayFromToday = new Date();
    sendDelayFromToday.setDate(sendDelayFromToday.getDate() + projStatusNotif.DelayDays);
    emailSendDate = sendDelayFromToday;
  }
  const queueObject = {
    Key: randomUUID(),
    Status: NotificationStatus.Pending,
    Priority: template.Priority,
    Encoding: template.Encoding,
    SendOn: emailSendDate,
    Subject: nunjucks.renderString(template.Subject, { Project: project }),
    BodyType: template.BodyType,
    Body: nunjucks.renderString(template.Body, {
      Title: Title,
      Uri: Uri,
      ToAgency: agency,
      Project: flattenProjectProperties(project),
    }),
    TemplateId: template.Id,
    To: [overrideTo ?? agency?.Email, template.To].filter((a) => a).join(';'),
    Cc: [agency?.CCEmail, template.Cc].filter((a) => a).join(';'),
    Bcc: template.Bcc,
    CreatedById: project.UpdatedById ?? project.CreatedById,
    ProjectId: project.Id,
    ToAgencyId: agency?.Id,
  };
  const insertedNotif = await query.manager.save(NotificationQueue, queueObject);
  if (queryRunner === undefined) {
    //If no arg passed we spawned a new query runner and we must release that!
    await query.release();
  }
  return insertedNotif;
};

/**
 * Generates project notifications based on the project's status change and notification templates.
 * @param project - The project for which notifications are generated.
 * @param previousStatusId - The previous status ID of the project.
 * @param queryRunner - Optional query runner for database operations.
 * @returns A promise that resolves with an array of inserted notification objects.
 */
const generateProjectNotifications = async (
  project: Project,
  previousStatusId: number,
  queryRunner?: QueryRunner,
) => {
  const query = queryRunner ?? AppDataSource.createQueryRunner();
  const projectStatusNotif1 = await query.manager.find(ProjectStatusNotification, {
    where: { FromStatusId: previousStatusId, ToStatusId: project.StatusId },
  });
  const projectStatusNotif2 = await query.manager.find(ProjectStatusNotification, {
    where: { FromStatusId: IsNull(), ToStatusId: project.StatusId },
  });
  const projectStatusNotifications = [...projectStatusNotif1, ...projectStatusNotif2];
  const returnNotifications = [];
  for (const projStatusNotif of projectStatusNotifications) {
    const template = await query.manager.findOne(NotificationTemplate, {
      where: { Id: projStatusNotif.TemplateId },
    });

    let overrideTo: string | null = null;
    if (template.Audience == NotificationAudience.ProjectOwner) {
      const owningUser = await query.manager.findOne(User, {
        where: { Id: project.CreatedById },
      });
      overrideTo = owningUser.Email;
      returnNotifications.push(
        insertProjectNotificationQueue(
          template,
          projStatusNotif,
          project,
          project.Agency,
          overrideTo,
          undefined,
          queryRunner,
        ),
      );
    } else if (template.Audience == NotificationAudience.OwningAgency) {
      returnNotifications.push(
        insertProjectNotificationQueue(
          template,
          projStatusNotif,
          project,
          project.Agency,
          undefined,
          undefined,
          queryRunner,
        ),
      );
    } else if (template.Audience == NotificationAudience.Agencies) {
      const agencies = await AppDataSource.getRepository(Agency)
        .createQueryBuilder('a')
        .leftJoin(
          ProjectAgencyResponse,
          'par',
          'a.id = par.agency_id AND par.project_id = :projectId',
          {
            projectId: project.Id,
          },
        )
        .andWhere('a.is_disabled = false')
        .andWhere('a.send_email = true')
        .andWhere(
          '(par.agency_id IS NULL OR (par.response != :unsubscribe AND par.response != :watch))',
          {
            unsubscribe: AgencyResponseType.Unsubscribe,
            watch: AgencyResponseType.Watch,
          },
        )
        .getMany();
      agencies.forEach((agc) =>
        returnNotifications.push(
          insertProjectNotificationQueue(
            template,
            projStatusNotif,
            project,
            agc,
            undefined,
            undefined,
            queryRunner,
          ),
        ),
      );
    } else if (template.Audience == NotificationAudience.ParentAgencies) {
      const agencies = await AppDataSource.getRepository(Agency)
        .createQueryBuilder('a')
        .leftJoin(
          ProjectAgencyResponse,
          'par',
          'a.id = par.agency_id AND par.project_id = :projectId',
          {
            projectId: project.Id,
          },
        )
        .where('a.parent_id IS NULL')
        .andWhere('a.is_disabled = false')
        .andWhere('a.send_email = true')
        .andWhere(
          '(par.agency_id IS NULL OR (par.response != :unsubscribe AND par.response != :watch))',
          {
            unsubscribe: AgencyResponseType.Unsubscribe,
            watch: AgencyResponseType.Watch,
          },
        )
        .getMany();
      agencies.forEach((agc) =>
        returnNotifications.push(
          insertProjectNotificationQueue(
            template,
            projStatusNotif,
            project,
            agc,
            undefined,
            undefined,
            queryRunner,
          ),
        ),
      );
    } else if (template.Audience == NotificationAudience.WatchingAgencies) {
      const agencies = await AppDataSource.getRepository(Agency)
        .createQueryBuilder('a')
        .leftJoin(
          ProjectAgencyResponse,
          'par',
          'a.id = par.agency_id AND par.project_id = :projectId',
          {
            projectId: project.Id,
          },
        )
        .andWhere('a.is_disabled = false')
        .andWhere('a.send_email = true')
        .andWhere('(par.agency_id IS NOT NULL AND par.response = :watch)', {
          watch: AgencyResponseType.Watch,
        })
        .getMany();
      agencies.forEach((agc) =>
        returnNotifications.push(
          insertProjectNotificationQueue(
            template,
            projStatusNotif,
            project,
            agc,
            undefined,
            undefined,
            queryRunner,
          ),
        ),
      );
    } else if (template.Audience == NotificationAudience.Default) {
      returnNotifications.push(
        insertProjectNotificationQueue(
          template,
          projStatusNotif,
          project,
          undefined,
          undefined,
          undefined,
          queryRunner,
        ),
      );
    }
  }
  if (queryRunner === undefined) {
    await query.release();
  }
  return await Promise.all(returnNotifications);
};

/**
 * Sends a notification using the provided details.
 * @param notification - The notification details to be sent.
 * @param user - The user to whom the notification is sent.
 * @param queryRunner - Optional query runner for database operations.
 * @returns The updated notification queue entry after attempting to send the notification.
 */
const sendNotification = async (
  notification: NotificationQueue,
  user: PimsRequestUser,
  queryRunner?: QueryRunner,
) => {
  const query = queryRunner ?? AppDataSource.createQueryRunner();
  let retNotif: NotificationQueue = null;
  try {
    const email: IEmail = {
      to: notification.To?.split(';').map((a) => a.trim()) ?? [],
      cc: notification.Cc?.split(';').map((a) => a.trim()) ?? [],
      bcc: notification.Bcc?.split(';').map((a) => a.trim()) ?? [],
      bodyType: EmailBody[notification.BodyType as keyof typeof EmailBody],
      subject: notification.Subject,
      body: notification.Body,
      encoding: EmailEncoding[notification.Encoding as keyof typeof EmailEncoding],
      priority: EmailPriority[notification.Priority as keyof typeof EmailPriority],
      tag: notification.Tag,
      delayTS: notification.SendOn.getTime(),
    };
    const response = await chesServices.sendEmailAsync(email, user);
    if (response) {
      // Note: Email may be intentionally disabled, thus yielding null response.
      retNotif = await query.manager.save(NotificationQueue, {
        ...notification,
        ChesTransactionId: response.txId as UUID,
        ChesMessageId: response.messages[0].msgId as UUID,
      });
    } else {
      retNotif = await query.manager.save(NotificationQueue, {
        ...notification,
        Status: NotificationStatus.Failed,
      });
    }
  } catch (e) {
    logger.error(e.message);
    retNotif = await query.manager.save(NotificationQueue, {
      ...notification,
      Status: NotificationStatus.Failed,
    });
  } finally {
    if (queryRunner === undefined) {
      await query.release();
    }
  }
  return retNotif;
};

/**
 * Converts a CHES status to a corresponding NotificationStatus.
 * @param chesStatus - The CHES status to be converted.
 * @returns The corresponding NotificationStatus enum value.
 */
const convertChesStatusToNotificationStatus = (chesStatus: string): NotificationStatus => {
  switch (chesStatus) {
    case 'accepted':
      return NotificationStatus.Accepted;
    case 'pending':
      return NotificationStatus.Pending;
    case 'cancelled':
      return NotificationStatus.Cancelled;
    case 'failed':
      return NotificationStatus.Failed;
    case 'completed':
      return NotificationStatus.Completed;
    case '404':
      return NotificationStatus.NotFound;
    default:
      return null;
  }
};

/**
 * Updates the status of a notification based on the CHES status retrieved asynchronously.
 * @param {number} notificationId - The ID of the notification to update.
 * @param {User} user - The user initiating the status update.
 * @returns {Promise<NotificationQueue>} The updated notification entity after status update.
 * @throws {Error} If the notification with the provided ID is not found or if status retrieval fails.
 */
const updateNotificationStatus = async (notificationId: number, user: User) => {
  const query = AppDataSource.createQueryRunner();
  const notification = await query.manager.findOne(NotificationQueue, {
    where: { Id: notificationId },
  });

  if (!notification || Object.keys(notification).length === 0) {
    throw new Error(`Notification with id ${notificationId} not found.`);
  }

  const statusResponse = await chesServices.getStatusByIdAsync(notification.ChesMessageId);
  if (typeof statusResponse?.status === 'string') {
    const notificationStatus = convertChesStatusToNotificationStatus(statusResponse.status);
    // If the CHES status is non-standard, don't update the notification.
    if (notificationStatus === null) {
      query.release();
      return notification;
    }
    notification.Status = notificationStatus;
    notification.UpdatedOn = new Date();
    notification.UpdatedById = user.Id;
    const updatedNotification = await query.manager.save(NotificationQueue, notification);

    query.release();
    return updatedNotification;
  } else if (typeof statusResponse?.status === 'number') {
    // handle 404, 422 code here....
    switch (statusResponse.status) {
      case 404: {
        notification.Status = NotificationStatus.NotFound;
        notification.UpdatedOn = new Date();
        notification.UpdatedById = user.Id;
        const updatedNotification = await query.manager.save(NotificationQueue, notification);
        logger.error(`Notification with id ${notificationId} not found on CHES.`);
        query.release();
        return updatedNotification;
      }

      case 422:
        logger.error(
          `Notification with id ${notificationId} could not be processed, some of the data could be formatted incorrectly.`,
        );
        break;

      case 401:
        logger.error(
          `Cannot authorize the request to the CHES server, check your CHES credentials.`,
        );
        break;

      case 500:
        logger.error(
          `Internal server error while retrieving status for notification with id ${notificationId}.`,
        );
        break;
      default:
        logger.error(`Received unexpected status code ${statusResponse.status}.`);
        break;
    }
    query.release();
    return notification;
  } else {
    query.release();
    throw new Error(`Failed to retrieve status for notification with id ${notificationId}.`);
  }
};

/**
 * Retrieves project notifications in the queue based on the provided filter.
 * Updates notifications in Pending or Accepted status by calling 'updateNotificationStatus'.
 * Returns a PageModel of NotificationQueue items with updated statuses.
 * @param filter - The filter object containing projectId, page, and pageSize.
 * @param user - The user initiating the notification updates.
 * @returns A Promise of PageModel<NotificationQueue> with updated notifications.
 */
const getProjectNotificationsInQueue = async (
  filter: ProjectNotificationFilter,
  user: User,
): Promise<PageModel<NotificationQueue>> => {
  const { projectId, page, pageSize } = filter;
  const notifications = await AppDataSource.getRepository(NotificationQueue).find({
    where: {
      ProjectId: projectId,
    },
    skip: (page ?? 0) * (pageSize ?? 0),
    take: pageSize ?? 0,
    order: { SendOn: 'ASC' },
  });

  const updatedNotifications: Promise<NotificationQueue>[] = [];
  for (const notification of notifications) {
    // run the updates for notifications that are in Pending or Accepted status as the other statuses are final
    if (
      notification.Status === NotificationStatus.Pending ||
      notification.Status === NotificationStatus.Accepted
    ) {
      const updatedNotification = updateNotificationStatus(notification.Id, user);
      updatedNotifications.push(updatedNotification);
    } else {
      updatedNotifications.push(Promise.resolve(notification));
    }
  }

  const pageModel: PageModel<NotificationQueue> = {
    items: await Promise.all(updatedNotifications), //May need to come back to this at some point as one email failing to update will make this entire promise reject.
    page: page ?? 0,
    pageSize: pageSize ?? 0,
  };

  return pageModel;
};

const cancelProjectNotifications = async (
  projectId: number,
  agencyId?: number,
  queryRunner?: QueryRunner,
) => {
  const query = queryRunner ?? AppDataSource.createQueryRunner();
  try {
    const notifications = await query.manager.find(NotificationQueue, {
      where: [
        { ProjectId: projectId, Status: NotificationStatus.Accepted, ToAgencyId: agencyId },
        { ProjectId: projectId, Status: NotificationStatus.Pending, ToAgencyId: agencyId },
      ],
    });
    const chesCancelPromises = notifications.map((notification) => {
      return chesServices.cancelEmailByIdAsync(notification.ChesMessageId);
    });
    const chesCancelResolved = await Promise.allSettled(chesCancelPromises);
    const cancelledMessageIds = chesCancelResolved
      .filter((a) => a.status === 'fulfilled' && a.value.status === 'cancelled')
      .map((c) => (c as PromiseFulfilledResult<IChesStatusResponse>).value.msgId);
    await query.manager.update(
      NotificationQueue,
      { ChesMessageId: In(cancelledMessageIds) },
      { Status: convertChesStatusToNotificationStatus('cancelled') },
    );
    return {
      succeeded: chesCancelResolved.filter(
        (c) => c.status === 'fulfilled' && c.value.status === 'cancelled',
      ).length,
      failed: chesCancelResolved.filter(
        (c) => c.status === 'rejected' || c.value?.status !== 'cancelled',
      ).length,
    };
  } catch (e) {
    logger.error(
      `Something went wrong when trying to cancel project notifications. Error: ${e.message}`,
    );
    return {
      succeeded: 0,
      failed: 0,
    };
  } finally {
    if (queryRunner === undefined) {
      query.release();
    }
  }
};

/**
 * Generates project notifications based off agency responses.
 * Agencies that opt out of notifications will have any pending notifications cancelled here.
 * Agencies that were not previously registered for notifications will have any delayed notifications,
 * such as 30,60,90 ERP reminders, queued as if they had been registered for these from the start.
 * @param project Up to date project entity.
 * @param responses Agency responses to process based off response type.
 * @param queryRunner Optional queryRunner, include if inside transaction.
 * @returns {NotificationQueue[]} A list of notifications queued by this function call
 */
const generateProjectWatchNotifications = async (
  project: Project,
  responses: ProjectAgencyResponse[],
  queryRunner?: QueryRunner,
) => {
  const query = queryRunner ?? AppDataSource.createQueryRunner();
  const notificationsInserted: Array<NotificationQueue> = [];
  try {
    for (const response of responses) {
      switch (response.Response) {
        case AgencyResponseType.Unsubscribe:
        case AgencyResponseType.Watch:
          //The simple case. Calling this will cancel all pending notifications for this project/agency pair.
          await cancelProjectNotifications(response.ProjectId, response.AgencyId);
          break;
        case AgencyResponseType.Subscribe: {
          const agency = await query.manager.findOne(Agency, {
            where: { Id: response.AgencyId },
          });
          //No use in queueing an email for an agency with no email address.
          if (agency?.Email) {
            /*We get the most recent entry in the status history since the date value of this row would have been populated 
            at the time this project was placed into its current status value. Note that this value is not necessarily the same as
            Project.UpdatedOn, as projects can be updated without the status being changed. */
            const mostRecentStatusChange = await query.manager.findOne(ProjectStatusHistory, {
              where: { ProjectId: project.Id },
              order: { CreatedOn: 'DESC' },
            });

            const mostRecentStatusChangeDate =
              mostRecentStatusChange?.CreatedOn ?? project.CreatedOn;
            const daysSinceThisStatus = getDaysBetween(mostRecentStatusChangeDate, new Date());
            const statusNotifs = await query.manager.find(ProjectStatusNotification, {
              relations: {
                Template: true,
              },
              where: {
                ToStatusId: project.StatusId, //We will only send notifications relevant to the current status.
                Template: {
                  Audience: NotificationAudience.WatchingAgencies,
                },
                DelayDays: MoreThan(daysSinceThisStatus),
              },
            });
            for (const statusNotif of statusNotifs) {
              //If there is already a pending notification for this agency with this template, skip.
              const notifExists = await query.manager.exists(NotificationQueue, {
                where: [
                  {
                    ProjectId: project.Id,
                    ToAgencyId: response.AgencyId,
                    TemplateId: statusNotif.TemplateId,
                    Status: NotificationStatus.Accepted,
                  },
                  {
                    ProjectId: project.Id,
                    ToAgencyId: response.AgencyId,
                    TemplateId: statusNotif.TemplateId,
                    Status: NotificationStatus.Pending,
                  },
                ],
              });

              if (!notifExists) {
                //If there is no notification like this already pending, we send one.
                const sendOn = new Date(mostRecentStatusChangeDate.getTime());
                sendOn.setDate(mostRecentStatusChangeDate.getDate() + statusNotif.DelayDays);
                //We set the delay by the most recent status change date plus the number of delay days. This should make these new emails
                //send around the same time as the emails that previously sent when this project changed into its current status.
                const inserted = await insertProjectNotificationQueue(
                  statusNotif.Template,
                  statusNotif,
                  project,
                  agency,
                  undefined,
                  sendOn,
                  queryRunner,
                );
                notificationsInserted.push(inserted);
              }
            }
          }
          break;
        }
      }
    }
  } catch (e) {
    logger.error(
      `Error: Some notification actions triggered by an agency response may have failed to cancel or update. Project ID: ${project.Id}, Error msg: ${e.message}`,
    );
    logger.error(e.stack);
  } finally {
    if (queryRunner === undefined) {
      query.release();
    }
  }
  return notificationsInserted;
};

const cancelNotificationById = async (id: number, user: User) => {
  const notification = await AppDataSource.getRepository(NotificationQueue).findOne({
    where: { Id: id },
  });
  const chesResult = await chesServices.cancelEmailByIdAsync(notification.ChesMessageId);
  if (chesResult.status === 'cancelled') {
    return AppDataSource.getRepository(NotificationQueue).save({
      Id: notification.Id,
      Status: NotificationStatus.Cancelled,
      UpdatedById: user.Id,
    });
  } else {
    return notification;
  }
};

const getNotificationById = async (id: number) => {
  return AppDataSource.getRepository(NotificationQueue).findOne({ where: { Id: id } });
};

const notificationServices = {
  generateProjectNotifications,
  generateAccessRequestNotification,
  generateProjectWatchNotifications,
  sendNotification,
  updateNotificationStatus,
  getProjectNotificationsInQueue,
  convertChesStatusToNotificationStatus,
  getNotificationById,
  cancelNotificationById,
  cancelProjectNotifications,
};

export default notificationServices;
