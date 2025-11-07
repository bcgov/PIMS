import React, { PropsWithChildren, useContext } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BannerContext } from '@/contexts/bannerContext';

interface IBaseLayoutProps extends PropsWithChildren {
  displayFooter?: boolean;
}

const BaseLayout = (props: IBaseLayoutProps) => {
  const bannerContext = useContext(BannerContext);
  const offsetHeaderHeight = bannerContext.headerOffsetHeight || 74; // The height of the header in pixels, used for layout calculations.
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
