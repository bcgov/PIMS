import React from 'react';
import { INotificationFilter } from 'features/projects/interfaces';
import { INotification } from 'features/projects/interfaces/INotification';
import { columns } from './constants';
import { Table } from 'components/Table';
import { formatDate } from 'utils';
import { useDisposalApi } from 'hooks/useApiDisposal';
import { useFormikContext } from 'formik';
import * as styled from './styled';
import { IProjectForm } from '../interfaces';

interface IProjectNotificationsProps {
  isReadOnly?: boolean;
  notifications?: [];
}

export const ProjectNotifications: React.FC<IProjectNotificationsProps> = props => {
  const { values } = useFormikContext<IProjectForm>();

  var projectId = values.id ?? 0;
  var projectNumber = values.projectNumber;
  const [total, setTotal] = React.useState(0);
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [filter] = React.useState<INotificationFilter>({ page: 1, projectId });

  const api = useDisposalApi(projectId);

  const onRequestData = React.useCallback(
    async ({ pageIndex }) => {
      const response = await api.getNotificationsPage({
        ...filter,
        page: pageIndex + 1,
      });
      setNotifications(response.items);
      setTotal(response.total);
    },
    [filter, api],
  );

  let notificationsList = notifications.map(
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
    <styled.ProjectNotifications>
      <h3>Notifications: {total}</h3>
      <div>
        <Table<INotification>
          name="notificationsTable"
          columns={columns}
          pageCount={Math.ceil(total / 10)}
          data={notificationsList}
          onRequestData={onRequestData}
        />
      </div>
    </styled.ProjectNotifications>
  );
};
