import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { INotification, INotificationFilter } from 'features/projects/interfaces';
import { IPagedItems } from 'interfaces/pagedItems';
import { useCallback } from 'react';
import React from 'react';

export interface DisposalAPI extends AxiosInstance {
  getNotificationsPage: (params: INotificationFilter) => Promise<IPagedItems<INotification>>;
}

export const useDisposalApi = (): DisposalAPI => {
  const axios = CustomAxios() as DisposalAPI;

  /**
   * Make an AJAX request to fetch the specified notifications.
   * @param filter The filter which to apply to the notifications.
   * @returns A promise containing the notifications.
   */
  axios.getNotificationsPage = useCallback(async (filter: INotificationFilter) => {
    const { data } = await axios.post<IPagedItems<INotification>>(
      `${ENVIRONMENT.apiUrl}/projects/disposal/notifications`,
      filter,
    );
    return data;
  }, []);
  return React.useMemo(() => axios, []);
};
