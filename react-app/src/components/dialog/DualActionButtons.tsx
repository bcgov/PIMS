import { Box, Button, ButtonProps } from '@mui/material';
import React from 'react';

interface IDualActionButtons {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  confirmButtonProps?: ButtonProps;
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
      <Button
        sx={{ fontWeight: 'bold' }}
        variant="contained"
        onClick={() => onConfirm()}
        {...confirmButtonProps}
      >
        {confirmText}
      </Button>
    </Box>
  );
};

export default DualActionButtons;
