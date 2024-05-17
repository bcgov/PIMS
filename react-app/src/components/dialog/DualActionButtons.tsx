import { Box, Button } from '@mui/material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import React from 'react';

interface IDualActionButtons {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  confirmButtonProps?: LoadingButtonProps;
}

const DualActionButtons = (props: IDualActionButtons) => {
  const { onConfirm, onCancel, confirmText, cancelText, confirmButtonProps } = props;
  return (
    <Box display={'flex'} gap={'1rem'}>
      <Button
        variant="outlined"
        style={{ fontWeight: 'bold', color: 'black', border: '1px solid lightgrey' }}
        onClick={() => onCancel()}
      >
        {cancelText}
      </Button>
      <LoadingButton
        sx={{ fontWeight: 'bold' }}
        variant="contained"
        onClick={() => onConfirm()}
        {...confirmButtonProps}
      >
        {confirmText}
      </LoadingButton>
    </Box>
  );
};

export default DualActionButtons;
