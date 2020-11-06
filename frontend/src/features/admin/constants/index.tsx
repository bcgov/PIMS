import * as React from 'react';
import { ColumnWithProps } from 'components/Table';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import { IAgency, IAgencyRecord } from 'interfaces';

export const columnDefinitions: ColumnWithProps<IAgencyRecord>[] = [
  {
    Header: 'Agency name',
    accessor: 'name',
    align: 'left',
    sortable: true,
    clickable: true,
  },
  {
    Header: 'Short name',
    accessor: 'code',
    align: 'left',
    clickable: true,
    sortable: true,
  },
  {
    Header: 'Description',
    accessor: 'description',
    align: 'left',
    clickable: true,
    sortable: true,
  },
  {
    Header: 'Parent Agency',
    accessor: 'parent',
    align: 'left',
    clickable: true,
    Cell: (props: CellProps<IAgency>) => {
      return (
        <Link to={`/admin/agency/${props.row.original.parentId}`}>{props.row.original.parent}</Link>
      );
    },
    sortable: true,
  },
];
