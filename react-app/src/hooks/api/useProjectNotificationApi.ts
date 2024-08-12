import { IFetch } from '../useFetch';

export interface NotificationQueue {
  Bcc: string;
  Body: string;
  BodyType: string;
  Cc: string;
  ChesMessageId: string;
  ChesTransactionId: string;
  CreatedById: string;
  CreatedOn: Date;
  Encoding: string;
  Id: number;
  Key: string;
  Priority: string;
  ProjectId: number;
  SendOn: Date;
  Status: number;
  Subject: string;
  Tag: string;
  TemplateId: number;
  To: string;
  ToAgencyId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

export interface NotificationResponse {
  items: NotificationQueue[];
  pageNumber: number;
  pageSize: number;
}

const useProjectNotificationsApi = (absoluteFetch: IFetch) => {
  const getNotificationsByProjectId = async (projectId: number): Promise<NotificationResponse> => {
    const { parsedBody } = await absoluteFetch.get('/notifications/queue', {
      projectId,
    });
    return parsedBody as NotificationResponse;
  };
  const resendNotification = async (notificationId: number) => {
    return absoluteFetch.put(`/notifications/queue/${notificationId}`);
  };
  const cancelNotification = async (notificationId: number) => {
    const response = await absoluteFetch.del(`/notifications/queue/${notificationId}`);
    if (!response.ok) {
      response.parsedBody = 'Unable to cancel notification.';
    }
    return response;
  };
  return {
    getNotificationsByProjectId,
    resendNotification,
    cancelNotification,
  };
};

export default useProjectNotificationsApi;
