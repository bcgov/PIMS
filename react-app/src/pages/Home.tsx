import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseLayout from '@/components/layout/BaseLayout';
import propertyVector from '@/assets/images/hero.svg';
import { landingPageBottomText, landingPageTopText } from '@/constants/strings';

export const Home = () => {
  return (
    <BaseLayout displayFooter>
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
              {landingPageTopText}
            </Typography>
            <Typography variant="h4" fontWeight={500}>
              {landingPageBottomText}
            </Typography>
          </Box>
          <Box>
            <img src={propertyVector} alt={'Property vector image.'} />
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
};
