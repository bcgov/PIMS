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
  return {
    getNotificationsByProjectId,
  };
};

export default useProjectNotificationsApi;
