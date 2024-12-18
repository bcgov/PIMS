import { AppDataSource } from '@/appDataSource';
import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { User } from '@/typeorm/Entities/User';
import logger from '@/utilities/winstonLogger';
import { IsNull, LessThan, Not } from 'typeorm';
import nunjucks from 'nunjucks';
import getConfig from '@/constants/config';
import chesServices, { EmailBody, IEmail } from '@/services/ches/chesServices';
import { PimsRequestUser } from '@/middleware/userAuthCheck';
import { Project } from '@/typeorm/Entities/Project';
import networking from '@/constants/networking';

// Retrieves overdue notifications belonging to projects
const getOverdueNotifications = async (joinProjects: boolean = false) =>
  await AppDataSource.getRepository(NotificationQueue).find({
    where: {
      Status: NotificationStatus.Pending,
      SendOn: LessThan(new Date()),
      ProjectId: Not(IsNull()),
    },
    relations: {
      Project: joinProjects,
    },
  });

/**
 * Used to check for notifications in the Pending state that have past their send date.
 * If any notifications are found, an attempt to update their status is made.
 * If any are still Pending after update, an email is created and sent to the business contact email.
 */
const failedEmailCheck = async () => {
  try {
    // Get all the notification records that are still pending and past their send date.
    const overdueNotifications = await getOverdueNotifications();
    // Get system user
    const system = await AppDataSource.getRepository(User).findOneOrFail({
      where: { Username: 'system' },
    });
    // Update these records
    await Promise.all(
      overdueNotifications.map((notif) =>
        notificationServices.updateNotificationStatus(notif.Id, system),
      ),
    );
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
      const sendResult = await chesServices.sendEmailAsync(email, system as PimsRequestUser);
      // If the email fails to send, throw an error for logging purposes.
      if (sendResult == null) {
        throw new Error('Email was attempted but not sent. This feature could be disabled.');
      }
    }
  } catch (e) {
    logger.error(`Error in failedEmailCheck: ${(e as Error).message}`);
  }
};

export default failedEmailCheck;
