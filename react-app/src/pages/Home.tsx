import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';

export const Home = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box component="main" flex="1 1 auto">
        <Box
          flexDirection={'column'}
          flexGrow={1}
          display={'flex'}
          justifyContent={'center'}
          height={'100%'}
          bgcolor={'#F8F8F8'}
        >
          <Box gap={'32px'} maxWidth={'1090px'} marginX={'auto'} display={'flex'}>
            <Box>
              <Typography marginBottom={'16px'} variant="h1" fontSize={'2.5rem'}>
                Search and Visualize Government Property
              </Typography>
              <Typography variant="h4" fontWeight={500}>
                Placeholder text about visualizing the government property will fill some space
                here.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h1" fontSize={'2.5rem'} maxWidth={'370px'}>
                Picture placeholder
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
