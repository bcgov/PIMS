import { DialogProps } from '@mui/material';
import { LoadingButtonProps } from '@mui/lab/LoadingButton';
import BaseDialog from './BaseDialog';
import DualActionButtons from './DualActionButtons';
import React, { PropsWithChildren } from 'react';

interface IConfirmDialog extends PropsWithChildren {
  title: string;
  open: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
  confirmButtonText?: string;
  confirmButtonProps?: LoadingButtonProps;
  dialogProps?: Omit<DialogProps, 'open'>;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  const {
    title,
    open,
    onConfirm,
    onCancel,
    confirmButtonProps,
    confirmButtonText,
    children,
    dialogProps,
  } = props;
  return (
    <BaseDialog
      open={open}
      title={title}
      dialogProps={dialogProps}
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
