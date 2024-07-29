import { INotificationResponse } from '@/components/projects/ProjectNotificationsTable';
import { IFetch } from '../useFetch';

const useProjectNotificationsApi = (absoluteFetch: IFetch) => {
  const getNotificationsByProjectId = async (projectId: number): Promise<INotificationResponse> => {
    const { parsedBody } = await absoluteFetch.get('/notifications/queue', {
      projectId,
    });
    return parsedBody as INotificationResponse;
  };
  return {
    getNotificationsByProjectId,
  };
};

export default useProjectNotificationsApi;
