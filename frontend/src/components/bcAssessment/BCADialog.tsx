import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { HeaderDivider } from 'features/mapSideBar/components/tabs/HeaderDivider';
import { tabStyles } from 'features/mapSideBar/components/tabs/TabStyles';
import React, { Dispatch, SetStateAction } from 'react';
import formatCurrency from 'utils/formatCurrency';

export interface IBCAData {
  GEN_NET_IMPROVEMENT_VALUE: number;
  GEN_NET_LAND_VALUE: number;
  GEN_GROSS_LAND_VALUE: number;
  GEN_GROSS_IMPROVEMENT_VALUE: number;
  FOLIO_ID: string;
}

interface IBCADialogProps {
  bcaInfoOpen: boolean;
  setBcaInfoOpen: Dispatch<SetStateAction<boolean>>;
  bcaData: IBCAData;
}

export const BCADialog = (props: IBCADialogProps) => {
  const { bcaInfoOpen, setBcaInfoOpen, bcaData } = props;
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;
  const noInfoParagraphStyle = {
    display: 'flex',
    margin: '1em',
    color: 'GrayText',
    fontSize: '11pt',
  };
  return (
    <Dialog
      open={bcaInfoOpen}
      scroll={'body'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={'md'}
    >
      <DialogTitle id="scroll-dialog-title">BC Assessment Information</DialogTitle>
      <DialogContent>
        {bcaData.FOLIO_ID ? (
          <div className="title">
            <Box sx={{ p: 2, background: 'white' }}>
              {/* HEADER */}
              <Stack direction="row" spacing={1}>
                <Typography
                  text-align="left"
                  sx={{ fontWeight: boldFontWeight, color: headerColour }}
                >
                  Details
                </Typography>
              </Stack>
              <HeaderDivider />

              {/* CONTENT */}
              <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
                <Grid item xs={leftColumnWidth}>
                  <Typography fontSize={fontSize}>Folio ID:</Typography>
                </Grid>
                <Grid item xs={rightColumnWidth}>
                  <Typography fontSize={fontSize}>{bcaData?.FOLIO_ID}</Typography>
                </Grid>

                <Grid item xs={leftColumnWidth}>
                  <Typography fontSize={fontSize}>Net Improvement Value:</Typography>
                </Grid>
                <Grid item xs={rightColumnWidth}>
                  <Typography fontSize={fontSize}>
                    {formatCurrency(bcaData.GEN_NET_IMPROVEMENT_VALUE)}
                  </Typography>
                </Grid>

                <Grid item xs={leftColumnWidth}>
                  <Typography fontSize={fontSize}>Net Land Value:</Typography>
                </Grid>
                <Grid item xs={rightColumnWidth}>
                  <Typography fontSize={fontSize}>
                    {formatCurrency(bcaData?.GEN_NET_LAND_VALUE)}
                  </Typography>
                </Grid>

                <Grid item xs={leftColumnWidth}>
                  <Typography fontSize={fontSize}>Gross Improvement Value:</Typography>
                </Grid>
                <Grid item xs={rightColumnWidth}>
                  <Typography fontSize={fontSize}>
                    {formatCurrency(bcaData?.GEN_GROSS_IMPROVEMENT_VALUE)}
                  </Typography>
                </Grid>

                <Grid item xs={leftColumnWidth}>
                  <Typography fontSize={fontSize}>Gross Land Value:</Typography>
                </Grid>
                <Grid item xs={rightColumnWidth}>
                  <Typography fontSize={fontSize}>
                    {formatCurrency(bcaData?.GEN_GROSS_LAND_VALUE)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </div>
        ) : (
          <>
            <p style={noInfoParagraphStyle}>
              No BC Assessment information available for this PID or information still loading.
            </p>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setBcaInfoOpen(false);
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
