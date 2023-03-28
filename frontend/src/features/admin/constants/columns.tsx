import { ColumnWithProps } from 'components/Table';
import { IAgencyRecord } from 'interfaces';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CellProps } from 'react-table';

export const columnDefinitions: ColumnWithProps<IAgencyRecord>[] = [
  {
    Header: 'Agency name',
    accessor: 'name',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Short name',
    accessor: 'code',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Description',
    accessor: 'description',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Parent Agency',
    accessor: 'parent',
    align: 'left',
    clickable: true,
    Cell: (props: CellProps<IAgencyRecord, string | undefined>) => {
      return (
        <Link to={`/admin/agency/${props.row.original.parentId}`}>{props.row.original.parent}</Link>
      );
    },
  },
];

export const adminAreasColumnDefinistions: ColumnWithProps<any>[] = [
  {
    Header: 'Area name',
    accessor: 'name',
    align: 'left',
    clickable: true,
  },
];
