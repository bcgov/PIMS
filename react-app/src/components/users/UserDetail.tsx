import React from 'react';
import DataCard from '../display/DataCard';
import { Box } from '@mui/material';

const UserDetail = () => {
  //Backend hooks etc would go here.
  const userData = {
    Status: 'Active',
    Role: 'System Admin',
    Created: new Date(),
    LastLogin: new Date(),
  };

  return (
    <Box>
      <DataCard values={userData} title={'User Profile'} />
    </Box>
  );
};

export default UserDetail;
