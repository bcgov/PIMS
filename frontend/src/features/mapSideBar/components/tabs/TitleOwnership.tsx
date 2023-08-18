import { Box, Grid, Stack, Table, TableHead, Typography } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

import { ChargesTable } from '../tables/ChargeTable';
import { OwnershipTable } from '../tables/OwnershipTable';
import { HeaderDivider } from './HeaderDivider';
import { tabStyles } from './TabStyles';

interface ITitleOwnershipProps {
  withNameSpace: Function;
}

export const TitleOwnership: React.FC<any> = (props: ITitleOwnershipProps) => {
  const { withNameSpace } = props;
  const formikProps = useFormikContext();
  const [ltsa, setLTSA] = useState<ILTSAOrderModel | undefined>(undefined);

  useEffect(() => {
    getLTSAInfo();
  }, [formikProps]);

  const getLTSAInfo = useCallback(async () => {
    const ltsaInfo: ILTSAOrderModel | undefined = await getIn(
      formikProps.values,
      withNameSpace('ltsa'),
    );
    if (ltsaInfo) {
      setLTSA(ltsaInfo);
    }
  }, [formikProps]);

  // Style Constants
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;

  const calculateCurrency = (value: number | string | undefined) => {
    if (!value) {
      return '';
    }

    let cleanedValue = 0;
    if (typeof value === 'string') {
      cleanedValue = parseFloat(value.replace(',', '').replace('$', ''));
    } else if (typeof value === 'number') {
      cleanedValue = value;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
    }).format(cleanedValue);
  };

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
                {calculateCurrency(
                  ltsa?.order.orderedProduct.fieldedData.tombstone.marketValueAmount,
                )}
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
              Ownership Information by Interest Fraction
            </Typography>
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            <OwnershipTable {...{ ltsa }} />
          </Grid>
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
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            <ChargesTable {...{ ltsa }} />
          </Grid>
        </Box>
      </div>
    </>
  );
};
