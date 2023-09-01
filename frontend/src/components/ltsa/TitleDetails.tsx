import { Box, Grid, Stack, Typography } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { HeaderDivider } from 'features/mapSideBar/components/tabs/HeaderDivider';
import { tabStyles } from 'features/mapSideBar/components/tabs/TabStyles';
import React from 'react';

interface ITitleDetailsProps {
  ltsa?: ILTSAOrderModel;
}

export const TitleDetails = (props: ITitleDetailsProps) => {
  const { ltsa } = props;
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;

  const calculateCurrency = (value: number | string | undefined) => {
    if (!value) {
      return '';
    }

    let cleanedValue = 0;
    if (typeof value === 'string') {
      cleanedValue = parseFloat(value.replace(',', '').replace('$', ''));
      if (Number.isNaN(cleanedValue)) {
        return '';
      }
    } else if (typeof value === 'number') {
      cleanedValue = value;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
    }).format(cleanedValue);
  };

  return (
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
            <Typography fontSize={fontSize}>Sales History:</Typography>
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
  );
};
