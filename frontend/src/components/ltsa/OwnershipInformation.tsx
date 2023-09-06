import { Box, Grid, Stack, Typography } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { OwnershipTable } from 'features/mapSideBar/components/tables/OwnershipTable';
import { HeaderDivider } from 'features/mapSideBar/components/tabs/HeaderDivider';
import { tabStyles } from 'features/mapSideBar/components/tabs/TabStyles';
import React from 'react';

interface IOwnershipInformationProps {
  ltsa?: ILTSAOrderModel;
}

export const OwnershipDetails = (props: IOwnershipInformationProps) => {
  const { ltsa } = props;
  const { boldFontWeight, headerColour } = tabStyles;

  return (
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
  );
};
