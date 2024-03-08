import React, { PropsWithChildren } from 'react';
import { Box, Toolbar } from '@mui/material';
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
      <Toolbar />
      <Box component="main" flex="1 1 auto">
        {props.children}
      </Box>
      {props.displayFooter && <Footer />}
    </Box>
  );
};

export default BaseLayout;
