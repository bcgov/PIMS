import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

const Forbidden = () => {
  return (
    <Box
      display="flex"
      flexDirection={'column'}
      width="600px"
      marginX="auto"
      alignSelf={'center'}
      mt={'4rem'}
    >
      <Paper sx={{ padding: 2 }}>
        <Typography textAlign={'center'}>
          You either do not have permission to access this page or your credentials have expired.
          Try signing in again.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Forbidden;
