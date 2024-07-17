import { INotificationModel } from '@/components/projects/ProjectNotificationsTable';
import { IFetch } from '../useFetch';

const useProjectNotificationsApi = (absoluteFetch: IFetch) => {
  const getNotificationsByProjectId = async (projectId: number): Promise<INotificationModel[]> => {
    const { parsedBody } = await absoluteFetch.get('/notifications/queue', {
      projectId,
    });
    return parsedBody as INotificationModel[];
  };
  return {
    getNotificationsByProjectId,
  };
};

export default useProjectNotificationsApi;
