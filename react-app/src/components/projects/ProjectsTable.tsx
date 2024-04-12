import usePimsApi from '@/hooks/usePimsApi';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import React from 'react';
import useDataLoader from '@/hooks/useDataLoader';

const ProjectsTable = () => {
  const api = usePimsApi();
  const navigate = useNavigate();

  const { data, loadOnce } = useDataLoader(api.projects.getProjects);
  loadOnce();
  const columns: GridColDef[] = [
    {
      field: 'ProjectNumber',
      headerName: 'Project No.',
      flex: 1,
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
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
    },
    {
      field: 'NetBook',
      headerName: 'Net Book Value',
      flex: 1,
    },
    {
      field: 'Market',
      headerName: 'Market Value',
      flex: 1,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Updated On',
      flex: 1,
    },
    {
      field: 'UpdatedBy',
      headerName: 'Updated By',
      flex: 1,
    },
  ];

  return (
    <FilterSearchDataGrid
      onPresetFilterChange={() => {}}
      defaultFilter={'All Projects'}
      presetFilterSelectOptions={[
        <CustomMenuItem key={'All Projects'} value={'All Projects'}>
          All Projects
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