import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { TitleOwnership } from 'features/mapSideBar/components/tabs/TitleOwnership';
import React, { Dispatch, SetStateAction } from 'react';

interface ILTSADialogProps {
  ltsaInfoOpen: boolean;
  setLtsaInfoOpen: Dispatch<SetStateAction<boolean>>;
  ltsa: ILTSAOrderModel | undefined;
  setLtsa: Dispatch<SetStateAction<ILTSAOrderModel | undefined>>;
}

export const LTSADialog = (props: ILTSADialogProps) => {
  const { ltsaInfoOpen, setLtsaInfoOpen, ltsa, setLtsa } = props;

  return (
    <Dialog
      open={ltsaInfoOpen}
      scroll={'body'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={'md'}
    >
      <DialogTitle id="scroll-dialog-title">LTSA Information</DialogTitle>
      <DialogContent>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <TitleOwnership {...{ ltsa }} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setLtsaInfoOpen(false);
            setLtsa(undefined);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
