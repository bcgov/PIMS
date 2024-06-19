import React, { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface IBaseLayoutProps extends PropsWithChildren {
  displayFooter?: boolean;
}

const BaseLayout = (props: IBaseLayoutProps) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      {/* Margin on box should be exactly the same size as the header. */}
      <Box component="main" flex="1 1 auto" height={'100%'} marginTop={'74px'}>
        {props.children}
      </Box>
      {props.displayFooter && <Footer />}
    </Box>
  );
};

export default BaseLayout;
