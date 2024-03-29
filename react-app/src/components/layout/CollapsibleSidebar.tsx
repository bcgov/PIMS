import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import {
  Avatar,
  Box,
  CSSObject,
  Drawer,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Theme,
  useTheme,
} from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';

interface ISideBarItem {
  title: string;
  subTitle?: string;
}

type ICollapsibleSidebar = {
  items: ISideBarItem[];
} & PropsWithChildren;

const CollapsibleSidebar = (props: ICollapsibleSidebar) => {
  const openWidth = '300px';
  const closedWidth = 'calc(52px + 2rem)';
  const openedMixin = (theme: Theme): CSSObject => ({
    width: openWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: closedWidth,
  });

  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? openWidth : closedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? openWidth : closedWidth,
            boxSizing: 'border-box',
          },
          ...(drawerOpen && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!drawerOpen && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        }}
      >
        <Box display={'flex'} sx={{ ml: '1rem', mt: '88px', mr: '1rem' }}>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <Avatar
              style={{
                backgroundColor: '#eee',
                height: 36,
                width: 36,
              }}
            >
              <Icon sx={{ mb: '2px' }}>
                <img
                  height={18}
                  width={18}
                  src={sideBarIcon}
                  style={{ transform: `rotate(${drawerOpen ? '3.142rad' : '0'})` }}
                />
              </Icon>
            </Avatar>
          </IconButton>
        </Box>
        <Box>
          {drawerOpen &&
            props.items.map((item) => (
              <ListItem key={item.title}>
                <ListItemButton
                  onClick={() => {
                    const element = document.getElementById(item.title);
                    const y = element.getBoundingClientRect().top + window.scrollY + -74;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }}
                >
                  <ListItemText primary={item.title} secondary={item.subTitle} />
                </ListItemButton>
              </ListItem>
            ))}
        </Box>
      </Drawer>
      <Box ml={drawerOpen ? openWidth : closedWidth}>{props.children}</Box>
    </Box>
  );
};

export default CollapsibleSidebar;
