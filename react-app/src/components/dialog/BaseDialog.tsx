import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export interface IBaseDialog extends PropsWithChildren {
  open: boolean;
  title: string;
  actions: JSX.Element;
}

const BaseDialog = (props: IBaseDialog) => {
  const { open, title, children, actions } = props;
  return (
    <Dialog PaperProps={{ sx: { padding: '2rem' } }} open={open}>
      <DialogTitle variant="h2">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ alignSelf: 'center' }}>{actions}</DialogActions>
    </Dialog>
  );
};

export default BaseDialog;