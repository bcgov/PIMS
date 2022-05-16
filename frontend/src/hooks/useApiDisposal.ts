import { IPagedItems } from 'interfaces/pagedItems';
import CustomAxios from 'customAxios';
import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import { useCallback } from 'react';
import { INotificationFilter, INotification } from 'features/projects/interfaces';
import React from 'react';

export interface DisposalAPI extends AxiosInstance {
  getNotificationsPage: (params: INotificationFilter) => Promise<IPagedItems<INotification>>;
}

export const useDisposalApi = (id: number): DisposalAPI => {
  const axios = CustomAxios() as DisposalAPI;

  /**
   * Make an AJAX request to fetch the specified notifications.
   * @param filter The filter which to apply to the notifications.
   * @returns A promise containing the notifications.
   */
  axios.getNotificationsPage = useCallback(
    async (filter: INotificationFilter) => {
      const { data } = await axios.post<IPagedItems<INotification>>(
        `${ENVIRONMENT.apiUrl}/projects/disposal/notifications`,
        filter,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => axios, []);
};
