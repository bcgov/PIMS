import React from 'react';
import headerImageLarge from '@/assets/images/BCGOV_logo.svg';
import headerImageSmall from '@/assets/images/BCID_V_rgb_pos.png';
import {
  AppBar,
  Link,
  Box,
  Button,
  Divider,
  Toolbar,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { Roles } from '@/constants/roles';

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
  const { logout, isAuthenticated, login, user } = useKeycloak();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLoginButton = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login({ idpHint: 'idir' });
    }
  };

  // Admin menu controls
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
              {user.client_roles?.includes(Roles.ADMIN) ? (
                <>
                  <Typography
                    id="admin-button"
                    aria-controls={open ? 'admin-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{
                      color: '#000',
                      fontWeight: 500,
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                    variant="h5"
                  >
                    Administration
                  </Typography>
                  <Menu
                    id="admin-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'admin-menu-button',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/agencies');
                        setAnchorEl(undefined);
                      }}
                    >
                      Agencies
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/adminAreas');
                        setAnchorEl(undefined);
                      }}
                    >
                      Administrative Areas
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <></>
              )}
              <Link underline="none" href="/properties" variant="h5">
                Active Inventory
              </Link>
              <Link underline="none" href="/projects" variant="h5">
                Disposal Inventory
              </Link>
              <Link underline="none" href="/users" variant="h5">
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
