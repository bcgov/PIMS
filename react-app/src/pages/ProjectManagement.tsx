import ProjectsTable from '@/components/projects/ProjectsTable';
import { Box, SxProps } from '@mui/material';
import React from 'react';

const ProjectManagement = () => {
  return (
    <Box
      sx={
        {
          padding: '24px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        } as SxProps
      }
    >
      <ProjectsTable />
    </Box>
  );
};

export default ProjectManagement;
