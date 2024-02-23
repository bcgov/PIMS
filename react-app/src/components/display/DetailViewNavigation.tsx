import React from 'react';
import Icon from '@mdi/react';
import { Box, IconButton, Avatar, Typography, Button, ButtonProps, useTheme } from '@mui/material';
import { mdiArrowLeft } from '@mdi/js';

interface IDetailViewNavigation {
  navigateBackTitle: string;
  deleteTitle: string;
  onDeleteClick: () => void;
  onBackClick: () => void;
  deleteButtonProps?: ButtonProps;
}

const DetailViewNavigation = (props: IDetailViewNavigation) => {
  const theme = useTheme();
  const { navigateBackTitle, deleteTitle, onDeleteClick, onBackClick, deleteButtonProps } = props;
  return (
    <Box display={'flex'} alignItems={'center'}>
      <IconButton onClick={() => onBackClick()}>
        <Avatar
          style={{ color: 'white', backgroundColor: 'white' }} //For some reason this doesn't get applied if you do it in sx props.
          sx={{ border: '0.1px solid lightgray' }}
        >
          <Icon color="black" size={0.9} path={mdiArrowLeft} />
        </Avatar>
      </IconButton>
      <Typography variant="h5">{navigateBackTitle}</Typography>
      <Button
        onClick={() => onDeleteClick()}
        sx={{ fontWeight: 'bold', color: theme.palette.warning.main, marginLeft: 'auto' }}
        {...deleteButtonProps}
      >
        {deleteTitle}
      </Button>
    </Box>
  );
};

export default DetailViewNavigation;
