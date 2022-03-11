import { ColumnWithProps } from 'components/Table';
import { INotification } from 'features/projects/interfaces/INotification';

export const columns: ColumnWithProps<INotification>[] = [
  {
    Header: 'To',
    accessor: 'to',
    align: 'left',
    clickable: false,
  },
  {
    Header: 'Project Number',
    accessor: 'projectNumber',
    align: 'left',
    clickable: false,
  },
  {
    Header: 'Subject',
    accessor: 'subject',
    align: 'left',
    clickable: false,
  },
  {
    Header: 'Status',
    accessor: 'status',
    align: 'left',
    clickable: false,
  },
  {
    Header: 'Date Sent / To Be Sent',
    accessor: 'sendOn',
    align: 'left',
    clickable: false,
  },
];
