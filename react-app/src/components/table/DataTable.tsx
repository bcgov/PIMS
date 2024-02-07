import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiDotsHorizontal } from '@mdi/js';
import {
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridOverlay,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';

type RenderCellParams = GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;

const NoRowsOverlay = (): JSX.Element => {
  return (
    <GridOverlay sx={{ height: '100%' }}>
      <Typography>No rows to display.</Typography>
    </GridOverlay>
  );
};

interface IDataGridFloatingMenuAction {
  label: string;
  iconPath: string;
  action: (cellParams: RenderCellParams) => void;
}

interface IDataGridFloatingMenuProps {
  menuActions: IDataGridFloatingMenuAction[];
  cellParams: RenderCellParams;
}

export const DataGridFloatingMenu = (props: IDataGridFloatingMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="data-grid-actions"
        onClick={handleClick}
        data-testid="data-grid-actions"
        tabIndex={0}
      >
        <Icon path={mdiDotsHorizontal} size={1} />
      </IconButton>
      <Menu
        sx={{ boxShadow: '3px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="data-grid-menu-container"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.menuActions.map((action) => (
          <MenuItem
            key={`menu-action-${action.label}`}
            onClick={() => {
              handleClose();
              action.action(props.cellParams);
            }}
          >
            <ListItemIcon>
              <Icon path={action.iconPath} size={1} />
            </ListItemIcon>
            <Typography variant="inherit">{action.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const CustomDataGrid = (props: DataGridProps) => {
  return (
    <DataGrid {...props} slots={{ noRowsOverlay: NoRowsOverlay, loadingOverlay: LinearProgress }} />
  );
};
