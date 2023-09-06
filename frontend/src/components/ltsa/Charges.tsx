import { Box, Grid, Stack, Typography } from '@mui/material';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { ChargesTable } from 'features/mapSideBar/components/tables/ChargeTable';
import { HeaderDivider } from 'features/mapSideBar/components/tabs/HeaderDivider';
import { tabStyles } from 'features/mapSideBar/components/tabs/TabStyles';
import React from 'react';

interface IChargesProps {
  ltsa?: ILTSAOrderModel;
}

export const Charges = (props: IChargesProps) => {
  const { ltsa } = props;
  const { boldFontWeight, headerColour } = tabStyles;

  return (
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
  );
};
