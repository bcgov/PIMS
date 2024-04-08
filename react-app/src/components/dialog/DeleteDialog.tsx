import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ConfirmDialog from './ConfirmDialog';

interface IDeleteDialog {
  open: boolean;
  title: string;
  message: string;
  deleteText?: string;
  onDelete: () => Promise<void>;
  onClose: () => Promise<void>;
}

const DeleteDialog = (props: IDeleteDialog) => {
  const { open, title, message, deleteText, onDelete, onClose } = props;
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
      confirmButtonProps={{ color: 'warning', disabled: textFieldValue.toLowerCase() != 'delete' }}
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
