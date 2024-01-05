import React from 'react';
import headerImageLarge from '@/assets/images/BCID_H_rgb_pos.png';
import headerImageSmall from '@/assets/images/BCID_V_rgb_pos.png';
import { AppBar, Box, Button, Divider, Toolbar, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
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
          mr: 2,
        },
      }}
    >
      <Link to="/" aria-label="Go to PIMS Home">
        <Box>
          <picture>
            <source srcSet={headerImageLarge} media="(min-width: 960px)"></source>
            <source srcSet={headerImageSmall} media="(min-width: 600px)"></source>
            <img
              src={headerImageSmall}
              alt={'Government of British Columbia'}
              style={{ height: '48px' }}
            />
          </picture>
        </Box>
        <Box>
          <Divider
            style={{ borderBottomWidth: '26px', borderRightWidth: '2px' }}
            orientation="vertical"
          />
        </Box>
        <Box
          sx={{
            marginLeft: '16px',
          }}
        >
          <Typography color={theme.palette.black.main} variant="h5">
            Property Inventory Management System
          </Typography>
        </Box>
      </Link>
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
      style={{
        backgroundColor: theme.palette.white.main,
        height: '74px',
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderBottomColor: theme.palette.gray.main,
      }}
    >
      <Toolbar>
        <AppBrand />
        <Box flexGrow={1}></Box>
        <Box gap={'32px'} display={'flex'}>
          {isAuthenticated && (
            <>
              <Button variant="text">Active Inventory</Button>
              <Button variant="text">Disposal Inventory</Button>
              <Button variant="text">Users</Button>
            </>
          )}
          <Button onClick={() => handleLoginButton()} variant="contained">
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
