import { AppDataSource } from '@/appDataSource';
import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { User } from '@/typeorm/Entities/User';
import logger from '@/utilities/winstonLogger';
import { IsNull, LessThan, LessThanOrEqual, Not } from 'typeorm';
import nunjucks from 'nunjucks';
import getConfig from '@/constants/config';
import chesServices, { EmailBody, IEmail } from '@/services/ches/chesServices';
import { Project } from '@/typeorm/Entities/Project';
import networking from '@/constants/networking';

// Retrieves overdue notifications belonging to projects
const getOverdueNotifications = async (joinProjects: boolean = false) => {
  // Get notifications that should have sent before today.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0);
  return await AppDataSource.getRepository(NotificationQueue).find({
    where: {
      Status: NotificationStatus.Pending,
      SendOn: LessThan(startOfToday),
      ProjectId: Not(IsNull()),
    },
    relations: {
      Project: joinProjects,
    },
  });
};

const getNotificationsToSendNow = async () => {
  // Get anything up to this time.
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return await AppDataSource.getRepository(NotificationQueue).find({
    where: {
      Status: NotificationStatus.Pending,
      SendOn: LessThanOrEqual(endOfToday),
      ProjectId: Not(IsNull()),
    },
  });
};

const getNotificationsSentToChes = async () => {
  return await AppDataSource.getRepository(NotificationQueue).find({
    where: {
      Status: NotificationStatus.Pending,
      ChesMessageId: Not(IsNull()),
      ProjectId: Not(IsNull()),
    },
  });
};

export const sendQueuedNotifications = async () => {
  // Get notifications in Pending state with a SendOn of today or earlier.
  const notifications = await getNotificationsToSendNow();
  // Send these.
  // If they are past their send date, they will send, otherwise they will just stay in the queue
  let issues = 0;
  await Promise.all(
    notifications.map((notif) =>
      notificationServices.sendNotification(notif).catch(() => {
        issues++;
        logger.error(`sendQueuedNotifications: Failed to send notification with ID ${notif.Id}.`);
      }),
    ),
  );
  logger.info(
    `${notifications.length - issues} of ${notifications.length} queued notifications successfully sent.`,
  );
};

export const syncNotificationStatuses = async () => {
  // Identify pending notifications that should have been sent to CHES already.
  const overdueNotifications = await getNotificationsSentToChes();

  // Get system user
  const system = await AppDataSource.getRepository(User).findOneOrFail({
    where: { Username: 'system' },
  });

  // Ensure we have the most up-to-date status (Pending -> Complete)
  // The sync function will only update those with a CHES msg ID
  await Promise.all(
    overdueNotifications.map((notif) =>
      notificationServices.syncNotificationWithChes(notif.Id, system).catch(() => {
        logger.error(
          `syncNotificationStatuses: Failed to update notification with ID ${notif.Id}.`,
        );
      }),
    ),
  );
};

/**
 * Used to check for notifications in the Pending state that have past their send date.
 * Attempts to retrieve updated statuses for Pending notifications sent to CHES.
 * If any are still Pending after update, an email is created and sent to the business contact email.
 */
export const failedNotificationCheck = async () => {
  try {
    // Sync existing notifications that may be out of date.
    await syncNotificationStatuses();

    // Temporary interface to allow for URL to project
    interface ProjectWithLink extends Project {
      Link?: string;
    }
    // If any of those records are still Pending, send an email to business with project names.
    const stillOverdueNotifications = await getOverdueNotifications(true);
    if (stillOverdueNotifications.length > 0) {
      const uniqueProjects: Record<string, ProjectWithLink> = {};
      stillOverdueNotifications.forEach(
        (notif) =>
          (uniqueProjects[notif.ProjectId] = {
            ...notif.Project,
            Link: `${networking.FRONTEND_URL}/projects/${notif.ProjectId}`,
          }),
      );
      const emailBody = nunjucks.render('FailedProjectNotifications.njk', {
        Projects: Object.values(uniqueProjects) ?? [],
      });
      const config = getConfig();
      const email: IEmail = {
        to: [config.contact.toEmail],
        cc: [],
        from: config.contact.systemEmail, // Made up for this purpose.
        bodyType: EmailBody.Html,
        subject: 'PIMS Notifications Warning',
        body: emailBody,
      };
      const sendResult = await chesServices.sendEmailAsync(email);
      // If the email fails to send, throw an error for logging purposes.
      if (sendResult == null) {
        throw new Error('Email was attempted but not sent. This feature could be disabled.');
      }
    }
  } catch (e) {
    logger.error(`Error in failedEmailCheck: ${(e as Error).message}`);
  }
};
