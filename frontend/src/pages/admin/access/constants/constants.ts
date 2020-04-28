import { ColDef } from 'ag-grid-community';
import { IAccessRequest } from 'interfaces';
import { AccessStatusDisplay, AccessStatusDisplayMapper } from 'constants/accessStatus';

export const columnDefinitions = (): ColDef[] => {
  let items: ColDef[] = [
    {
      headerName: 'IDIR/BCeID',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      valueGetter: params => (params.data as IAccessRequest).user.username,
    },
    {
      headerName: 'First name',
      valueGetter: params => (params.data as IAccessRequest).user.firstName,
    },
    {
      headerName: 'Last name',
      valueGetter: params => (params.data as IAccessRequest).user.lastName,
    },
    {
      headerName: 'Email',
      valueGetter: params => (params.data as IAccessRequest).user.email,
      width: 250,
    },
    {
      headerName: 'Position',
      valueGetter: params => (params.data as IAccessRequest).position,
    },
    {
      headerName: 'Status',
      valueGetter: (params): AccessStatusDisplay =>
        AccessStatusDisplayMapper[(params.data as IAccessRequest).status],
      filter: false,
      sortable: false,
    },
    {
      headerName: 'Agency',
      valueGetter: params => (params.data as IAccessRequest).agencies[0].name,
      width: 250,
    },
    {
      headerName: 'Role',
      valueGetter: params => (params.data as IAccessRequest).roles[0].name,
    },
  ];

  items = items.map(column => ({
    filter: true,
    suppressMenu: true,
    cellClass: 'user-info-cell',
    sortable: true,
    minWidth: 230,
    ...column,
  }));

  return items;
};
