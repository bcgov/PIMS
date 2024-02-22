/* eslint-disable no-console */
//Simple component testing area.
import React from 'react';
import PropertyTable from '@/components/property/PropertyTable';
import ClassificationIcon from '@/components/property/ClassificationIcon';
import { Box } from '@mui/material';

const Dev = () => {
  return (
    <Box>
      <PropertyTable />
      <ClassificationIcon indicatorColor={'green'} iconType={'building'} />
    </Box>
  )

};

export default Dev;
