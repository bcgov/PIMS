import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ConfirmDialog from './ConfirmDialog';
import { LoadingButtonProps } from '@mui/lab';

interface IDeleteDialog {
  open: boolean;
  title: string;
  message: string;
  deleteText?: string;
  onDelete: () => Promise<any>;
  onClose: () => Promise<void>;
  confirmButtonProps?: LoadingButtonProps;
}

const DeleteDialog = (props: IDeleteDialog) => {
  const { open, title, message, deleteText, onDelete, onClose, confirmButtonProps } = props;
  const [textFieldValue, setTextFieldValue] = useState('');
  return (
    <ConfirmDialog
      open={open}
      title={title}
      onConfirm={async () => {
        await onDelete();
        setTextFieldValue('');
      }}
      onCancel={async () => {
        await onClose();
        setTextFieldValue('');
      }}
      confirmButtonText={deleteText ?? 'Delete'}
      confirmButtonProps={{
        color: 'warning',
        disabled: textFieldValue.toLowerCase() != 'delete',
        ...confirmButtonProps,
      }}
    >
      <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
        <Typography>{message}</Typography>
        <Typography>To confirm deletion, please type Delete below.</Typography>
        <TextField
          value={textFieldValue}
          onChange={(event) => {
            setTextFieldValue(event.target.value);
          }}
        />
      </Box>
    </ConfirmDialog>
  );
};

export default DeleteDialog;
