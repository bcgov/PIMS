import { AppDataSource } from '@/appDataSource';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { randomUUID } from 'crypto';
import nunjucks from 'nunjucks';

interface BasicNotificationData {
  Title: string;
  Uri: string;
}

interface AccessRequestData {
  FirstName: string;
  LastName: string;
}

enum NotificationStatus {
  Accepted = 0,
  Pending = 1,
  Cancelled = 2,
  Failed = 3,
  Completed = 4,
}

const Title = 'PIMS';
const Uri = '';

const generateAccessRequestNotification = async (
  accessRequest: AccessRequestData,
  templateId: number,
  to?: string,
): Promise<NotificationQueue> => {
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
    Body: body,
    TemplateId: template.Id,
  };
  return AppDataSource.getRepository(NotificationQueue).save(queueObject);
};

const buildProjectNotification = () => {};

const sendNotification = () => {
  AppDataSource.getRepository(NotificationQueue).save({});
};

const notificationServices = {
  buildProjectNotification,
  generateAccessRequestNotification,
  sendNotification,
};

export default notificationServices;
