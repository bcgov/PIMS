import React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

interface Project {
  Id: number;
  ProjectNumber: string;
  StatusName: string;
  Description: string;
}

interface AssociatedProjectsTableProps {
  linkedProjects: Project[];
}

const AssociatedProjectsTable: React.FC<AssociatedProjectsTableProps> = ({ linkedProjects }) => {
  const theme = useTheme();
  const columns: GridColDef[] = [
    {
      field: 'ProjectNumber',
      headerName: 'Project Number',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <Link
          to={`/projects/${params.row.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
        >
          {String(params.value)}
        </Link>
      ),
    },
    { field: 'StatusName', headerName: 'Status Name', width: 150 },
    {
      field: 'Description',
      headerName: 'Description',
      width: 550,
      renderCell: (params: GridCellParams) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
          {String(params.value)}
        </div>
      ),
    },
  ];

  const rows: GridRowsProp = linkedProjects.map((project) => ({
    id: project.Id,
    ProjectNumber: project.ProjectNumber,
    StatusName: project.StatusName,
    Description: project.Description,
  }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      hideFooter
      sx={{
        borderStyle: 'none',
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '& div div div div >.MuiDataGrid-cell': {
          borderBottom: 'none',
          borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'transparent',
        },
      }}
    />
  );
};

export default AssociatedProjectsTable;
