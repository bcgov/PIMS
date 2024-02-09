import { ButtonProps } from '@mui/material';
import BaseDialog from './BaseDialog';
import DualActionButtons from './DualActionButtons';
import React, { PropsWithChildren } from 'react';

interface IConfirmDialog extends PropsWithChildren {
  title: string;
  open: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
  confirmButtonText?: string;
  confirmButtonProps?: ButtonProps;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  const { title, open, onConfirm, onCancel, confirmButtonProps, confirmButtonText, children } =
    props;
  return (
    <BaseDialog
      open={open}
      title={title}
      actions={
        <DualActionButtons
          onCancel={onCancel}
          onConfirm={onConfirm}
          cancelText={'Cancel'}
          confirmButtonProps={confirmButtonProps}
          confirmText={confirmButtonText ?? 'Confirm'}
        />
      }
    >
      {children}
    </BaseDialog>
  );
};

export default ConfirmDialog;
