import { Box, Grid, Stack, Table, TableHead, Typography } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { getIn, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';

import { HeaderDivider } from './HeaderDivider';

interface ITitleOwnershipProps {
  withNameSpace: Function;
}

export const TitleOwnership: React.FC<any> = (props: ITitleOwnershipProps) => {
  const { withNameSpace } = props;
  const formikProps = useFormikContext();
  const [ltsa, setLTSA] = useState<ILTSAOrderModel | undefined>(undefined);

  useEffect(() => {
    const ltsaInfo: Promise<ILTSAOrderModel> = getIn(formikProps.values, withNameSpace('ltsa'));
    ltsaInfo.then((value) => {
      setLTSA(value);
      console.log(value);
    });
  }, [formikProps]);

  // Style Constants
  const leftColumnWidth = 3;
  const rightColumnWidth = 12 - leftColumnWidth;
  const boldFontWeight = 700;
  const fontSize = 14;
  const headerColour = '#1a57c7';

  return (
    <>
      <p
        style={{
          display: 'flex',
          margin: '1em',
          color: 'GrayText',
          fontSize: '11pt',
        }}
      >
        This information was retrieved from the Land Title & Service Authority (LTSA).
      </p>
      {/* TITLE */}
      <div className="title">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Title Details
            </Typography>
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            {/* TITLE NUMBER */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Title Number:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>
                {ltsa?.order.productOrderParameters.titleNumber}
              </Typography>
            </Grid>

            {/* LEGAL DESCRIPTION */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Legal Description:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>
                {ltsa?.order.orderedProduct.fieldedData.descriptionsOfLand[0].fullLegalDescription}
              </Typography>
            </Grid>

            {/* TITLE STATUS */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Title Status:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>{ltsa?.order.status}</Typography>
            </Grid>

            {/* MARKET VALUE */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Market Value:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'CAD',
                }).format(ltsa?.order.orderedProduct.fieldedData.tombstone.marketValueAmount || 0)}
              </Typography>
            </Grid>

            {/* APPLICATION RECEIVED */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Application Received:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>
                {ltsa
                  ? new Date(
                      ltsa.order.orderedProduct.fieldedData.tombstone.applicationReceivedDate,
                    ).toLocaleDateString()
                  : ''}
              </Typography>
            </Grid>

            {/* ENTERED ON */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Entered On:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <Typography fontSize={fontSize}>
                {ltsa
                  ? new Date(
                      ltsa.order.orderedProduct.fieldedData.tombstone.enteredDate,
                    ).toLocaleDateString()
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>

      {/* OWNERSHIP INFO */}
      <div className="ownership">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Ownership Information
            </Typography>
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}></Grid>
        </Box>
      </div>

      {/* CHARGES INFO */}
      <div className="ownership">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Charges
            </Typography>
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}></Grid>
        </Box>
      </div>
    </>
  );
};
