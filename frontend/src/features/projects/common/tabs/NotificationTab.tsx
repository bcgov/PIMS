import { Table } from 'components/Table';
import { INotificationFilter, IProject } from 'features/projects/interfaces';
import { INotification } from 'features/projects/interfaces/INotification';
import { useFormikContext } from 'formik';
import { useDisposalApi } from 'hooks/useApiDisposal';
import React, { useCallback, useMemo, useState } from 'react';
import { formatDate } from 'utils';

import { columnDefinitions } from './columns';

interface INotificationTabProps {
  isReadOnly?: boolean;
  notifications?: [];
}

const NotificationTab: React.FunctionComponent<INotificationTabProps> = () => {
  const columns = useMemo(() => columnDefinitions, []);
  const { values } = useFormikContext<IProject>();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [total, setTotal] = useState(0);

  const projectId = values.id ?? 0;
  const projectNumber = values.projectNumber;
  const [filter] = useState<INotificationFilter>({ page: 1, projectId });

  const api = useDisposalApi();

  const onRequestData = useCallback(
    async ({ pageIndex }: { pageIndex: number }) => {
      const response = await api.getNotificationsPage({
        ...filter,
        page: pageIndex + 1,
      });
      setNotifications(response.items);
      setTotal(response.total);
    },
    [filter, api],
  );

  const notificationsList = notifications.map(
    (a: INotification): INotification => ({
      to: a.to,
      subject: a.subject.replace('ACTION REQUIRED - Notification of Surplus Real Property - ', ''),
      status: a.status,
      id: a.id,
      key: a.key,
      projectId: a.projectId,
      projectNumber: projectNumber,
      total: a.total,
      sendOn: formatDate(a.sendOn),
    }),
  );

  return (
    <div>
      <h3>Notifications: {total}</h3>
      <div>
        <Table<INotification, any>
          name="notificationsTable"
          columns={columns}
          pageCount={Math.ceil(total / 10)}
          data={notificationsList}
          onRequestData={onRequestData}
        />
      </div>
    </div>
  );
};

export default NotificationTab;
