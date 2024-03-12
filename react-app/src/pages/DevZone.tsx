/* eslint-disable no-console */
//Simple component testing area.
import React from 'react';
import { Box, Button } from '@mui/material';
import ReactEsriLeafletMap from '@/components/map/ReactEsriLeafletMap';

const Dev = () => {
  return (
    <Box height={'900px'}>
      <Button
        onClick={() => {
          const b = document.cookie.match('(^|;)\\s*' + 'SMSESSION' + '\\s*=\\s*([^;]+)');
          console.log(document.cookie);
          console.log(b);
        }}
      >
        Get Cookie
      </Button>
      <ReactEsriLeafletMap />
    </Box>
  );
};

export default Dev;
