import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export interface IBaseDialog extends PropsWithChildren {
  open: boolean;
  title: string;
  actions: JSX.Element;
  dialogProps?: Omit<DialogProps, 'open'>;
}

const BaseDialog = (props: IBaseDialog) => {
  const { open, title, children, actions, dialogProps } = props;
  return (
    <Dialog PaperProps={{ sx: { padding: '2rem' } }} open={open} {...dialogProps}>
      <DialogTitle variant="h2">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ alignSelf: 'center' }}>{actions}</DialogActions>
    </Dialog>
  );
};

export default BaseDialog;
