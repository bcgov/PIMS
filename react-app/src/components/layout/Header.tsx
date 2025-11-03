import React, { useContext } from 'react';
import headerImageLarge from '@/assets/images/BCGOV_logo.svg';
import headerImageSmall from '@/assets/images/BCID_V_rgb_pos.png';
import {
  AppBar,
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
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { Roles } from '@/constants/roles';
import { UserContext } from '@/contexts/userContext';
import { BannerContext } from '@/contexts/bannerContext';

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

interface HeaderProps {
  offsetHeight: number;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { offsetHeight } = props;
  const auth = useContext(UserContext);
  const bannerContext = useContext(BannerContext);
  const { logout, isAuthenticated, login } = useSSO();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLoginButton = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
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
    <>
      <AppBar
        elevation={0}
        component={'nav'}
        style={{
          backgroundColor: theme.palette.white.main,
          height: `${offsetHeight}px`,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
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
            {isAuthenticated &&
              auth?.pimsUser?.data?.Status === 'Active' &&
              auth?.pimsUser?.data?.RoleId && (
                <>
                  {auth.pimsUser.hasOneOfRoles([Roles.ADMIN]) ? (
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
                            navigate(
                              '/admin/agencies?page=0&pageSize=100&columnSortName=Name&columnSortValue=asc',
                            );
                            setAnchorEl(undefined);
                          }}
                        >
                          Agencies
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate(
                              '/admin/adminAreas?columnSortName=Name&columnSortValue=asc&page=0&pageSize=100',
                            );
                            setAnchorEl(undefined);
                          }}
                        >
                          Administrative Areas
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate('/admin/bulk');
                            setAnchorEl(undefined);
                          }}
                        >
                          Bulk Upload
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <></>
                  )}
                  <RouterLink
                    style={{ color: theme.palette.black.main, textDecoration: 'none' }}
                    to="/properties?columnSortName=UpdatedOn&columnSortValue=desc&page=0&pageSize=100"
                  >
                    <Typography fontWeight={500} variant="h5">
                      Active Inventory
                    </Typography>
                  </RouterLink>
                  <RouterLink
                    style={{ color: theme.palette.black.main, textDecoration: 'none' }}
                    to="/projects?columnSortName=UpdatedOn&columnSortValue=desc&page=0&pageSize=100"
                  >
                    <Typography fontWeight={500} variant="h5">
                      Disposal Projects
                    </Typography>
                  </RouterLink>
                  <RouterLink
                    style={{ color: theme.palette.black.main, textDecoration: 'none' }}
                    to="/users?page=0&pageSize=100&columnSortName=Status&columnSortValue=desc"
                  >
                    <Typography fontWeight={500} variant="h5">
                      Users
                    </Typography>
                  </RouterLink>
                </>
              )}
            <Button onClick={() => handleLoginButton()} color="secondary" variant="contained">
              {isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </Box>
        </Toolbar>
        {bannerContext?.message && bannerContext?.message.length > 0 && (
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              fontFamily: theme.typography.fontFamily,
              color: theme.palette.black.main,
              backgroundColor: theme.palette.warning.light,
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              height: 'fit-content',
              padding: '0.2em 0.5em',
              overflow: 'clip',
              textAlign: 'center',
            }}
          >
            <span>{bannerContext?.message}</span>
          </Box>
        )}
      </AppBar>
    </>
  );
};

export default Header;
