import React from 'react';
import AdministrativeAreasTable from '@/components/adminAreas/AdministrativeAreasTable';
import { Box } from '@mui/material';

const AdminAreasManagement = () => {
  return (
    <Box
      sx={{
        padding: '24px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <AdministrativeAreasTable />
    </Box>
  );
};

export default AdminAreasManagement;
