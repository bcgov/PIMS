import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { TitleOwnership } from 'features/mapSideBar/components/tabs/TitleOwnership';
import React, { Dispatch, SetStateAction } from 'react';

interface ILTSADialogProps {
  ltsaInfoOpen: boolean;
  setLtsaInfoOpen: Dispatch<SetStateAction<boolean>>;
  ltsa: ILTSAOrderModel | undefined;
  pid: string;
}

export const LTSADialog = (props: ILTSADialogProps) => {
  const { ltsaInfoOpen, setLtsaInfoOpen, ltsa, pid } = props;

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
        <TitleOwnership {...{ ltsa, pid }} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setLtsaInfoOpen(false);
          }}
          sx={{
            backgroundColor: '#003366',
            color: '#F2F2F2',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#1A5A96',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
