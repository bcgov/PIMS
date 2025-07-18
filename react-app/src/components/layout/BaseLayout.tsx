import React, { PropsWithChildren, useContext } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LookupContext } from '@/contexts/lookupContext';

interface IBaseLayoutProps extends PropsWithChildren {
  displayFooter?: boolean;
}

const BaseLayout = (props: IBaseLayoutProps) => {
  const lookup = useContext(LookupContext);
  const offsetHeaderHeight = lookup?.data?.Config?.headerOffsetHeight || 74; // The height of the header in pixels, used for layout calculations.
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header offsetHeight={offsetHeaderHeight} />
      <Box
        component="main"
        flex="1 1 auto"
        position={'absolute'}
        top={`${offsetHeaderHeight}px`}
        height={`calc(100vh - ${offsetHeaderHeight}px)`}
        width={'100%'}
      >
        {props.children}
      </Box>
      {props.displayFooter && <Footer />}
    </Box>
  );
};

export default BaseLayout;
