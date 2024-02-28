/* eslint-disable no-console */
//Simple component testing area.
import React from 'react';
import { Box } from '@mui/material';
import ReactEsriLeafletMap from '@/components/map/ReactEsriLeafletMap';

const Dev = () => {
  return (
    <Box height={'900px'}>
      <ReactEsriLeafletMap />
    </Box>
  );
};

export default Dev;
