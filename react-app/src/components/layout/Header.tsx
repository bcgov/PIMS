import React from 'react';
import headerImageLarge from '@/assets/images/BCGOV_logo.svg';
import headerImageSmall from '@/assets/images/BCID_V_rgb_pos.png';
import { AppBar, Link, Box, Button, Divider, Toolbar, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

const AppBrand = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        '& a': {
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          textDecoration: 'none',
        },
        '& img': {
          mr: '12px',
        },
      }}
    >
      <RouterLink to="/" aria-label="Go to PIMS Home">
        <picture>
          <source srcSet={headerImageLarge} media="(min-width: 960px)"></source>
          <source srcSet={headerImageSmall} media="(min-width: 600px)"></source>
          <img
            src={headerImageSmall}
            alt={'Government of British Columbia'}
            style={{ height: '34px' }}
          />
        </picture>
        <Divider
          style={{ borderBottomWidth: '26px', borderRightWidth: '2px' }}
          orientation="vertical"
        />
        <Typography
          marginLeft={'16px'}
          color={theme.palette.black.main}
          variant="h4"
          fontSize={'1rem'}
        >
          Property Inventory Management System
        </Typography>
      </RouterLink>
    </Box>
  );
};

const Header: React.FC = () => {
  const { logout, isAuthenticated, login } = useKeycloak();
  const theme = useTheme();
  const handleLoginButton = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login({ idpHint: 'idir' });
    }
  };
  return (
    <AppBar
      elevation={0}
      component={'nav'}
      style={{
        backgroundColor: theme.palette.white.main,
        height: '74px',
        display: 'flex',
        position: 'fixed',
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderBottomColor: theme.palette.gray.main,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <AppBrand />
        <Box flexGrow={1}></Box>
        <Box textAlign={'center'} alignItems={'center'} gap={'32px'} display={'flex'}>
          {isAuthenticated && (
            <>
              <Link underline="none" href="/properties" variant="h5">
                Active Inventory
              </Link>
              <Link underline="none" href="#" variant="h5">
                Disposal Inventory
              </Link>
              <Link underline="none" href="/admin/users" variant="h5">
                Users
              </Link>
            </>
          )}
          <Button onClick={() => handleLoginButton()} color="secondary" variant="contained">
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
