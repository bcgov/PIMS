import usePimsApi from '@/hooks/usePimsApi';
import { GridColDef } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router-dom';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import React, { MutableRefObject } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import { dateFormatter, formatMoney, projectStatusChipFormatter } from '@/utilities/formatters';
import { Agency } from '@/hooks/api/useAgencyApi';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { User } from '@/hooks/api/useUsersApi';

const ProjectsTable = () => {
  const api = usePimsApi();
  //const navigate = useNavigate();

  const { data, loadOnce } = useDataLoader(api.projects.getProjects);
  loadOnce();

  const parseIntFromProjectNo = (projectNo: string) => {
    return Number(projectNo.match(/[a-zA-Z]+-?(\d+)/)[1]);
  };

  const columns: GridColDef[] = [
    {
      field: 'ProjectNumber',
      headerName: 'Project No.',
      flex: 1,
      maxWidth: 120,
      sortComparator: (a, b) => parseIntFromProjectNo(a) - parseIntFromProjectNo(b),
    },
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (value: any) => value?.Name ?? 'N/A',
      renderCell: (params) => projectStatusChipFormatter(params.value ?? 'N/A'),
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (value: Agency) => value?.Name ?? '',
    },
    {
      field: 'NetBook',
      headerName: 'Net Book Value',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (value) => formatMoney(value),
    },
    {
      field: 'Market',
      headerName: 'Market Value',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (value) => formatMoney(value),
    },
    {
      field: 'UpdatedOn',
      headerName: 'Updated On',
      flex: 1,
      valueFormatter: (date) => dateFormatter(date),
      maxWidth: 125,
    },
    {
      field: 'UpdatedBy',
      headerName: 'Updated By',
      flex: 1,
      maxWidth: 150,
      valueGetter: (user: User) => `${user?.FirstName ?? ''} ${user?.LastName ?? ''}`,
    },
  ];

  const selectPresetFilter = (
    value: string | Record<string, any>,
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    switch (value) {
      case 'All Projects':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Approved for Exemption':
      case 'Approved for ERP':
      case 'In ERP':
        ref.current.setFilterModel({ items: [{ value, operator: 'contains', field: 'Status' }] });
    }
  };

  return (
    <FilterSearchDataGrid
      onPresetFilterChange={selectPresetFilter}
      defaultFilter={'All Projects'}
      presetFilterSelectOptions={[
        <CustomMenuItem key={'All Projects'} value={'All Projects'}>
          All Projects
        </CustomMenuItem>,
        <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
        <CustomMenuItem key={'In ERP'} value={'In ERP'}>
          In ERP
        </CustomMenuItem>,
        <CustomMenuItem key={'Approved for ERP'} value={'Approved for ERP'}>
          Approved for ERP
        </CustomMenuItem>,
        <CustomMenuItem key={'Approved for Exemption'} value={'Approved for Exemption'}>
          Approved for Exemption
        </CustomMenuItem>,
      ]}
      getRowId={(row) => row.Id}
      tableHeader={'Disposal Projects'}
      excelTitle={'Projects'}
      addTooltip={'Create new project'}
      name={'projects'}
      columns={columns}
      rows={data ?? []}
    />
  );
};

export default ProjectsTable;
