import { GridColumnPair } from '@/components/common/GridHelpers';
import { BCAssessmentProperties } from '@/hooks/api/useBCAssessmentApi';
import { formatMoney } from '@/utilities/formatters';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';

interface BCAssessmentDetailsProps {
  data: BCAssessmentProperties | undefined;
  isLoading: boolean;
  width?: string | number;
}

const BCAssessmentDetails = (props: BCAssessmentDetailsProps) => {
  const { data, isLoading, width } = props;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent={'center'} paddingTop={'2em'} minWidth={width}>
        <CircularProgress />
      </Box>
    );
  }

  const leftColumnSize = 5;
  return (
    <Box minWidth={width} height={'300px'}>
      {data ? (
        <Grid container rowGap={1}>
          <GridColumnPair
            leftValue={'Folio ID'}
            rightValue={data.FOLIO_ID}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Roll Number'}
            rightValue={data.ROLL_NUMBER}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Net Improvement Value'}
            rightValue={formatMoney(data.GEN_NET_IMPROVEMENT_VALUE)}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Net Land Value'}
            rightValue={formatMoney(data.GEN_NET_LAND_VALUE)}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Gross Improvement Value'}
            rightValue={formatMoney(data.GEN_GROSS_IMPROVEMENT_VALUE)}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Gross Land Value'}
            rightValue={formatMoney(data.GEN_GROSS_LAND_VALUE)}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Jurisdiction'}
            rightValue={data.JURISDICTION}
            leftSize={leftColumnSize}
          />
          <GridColumnPair
            leftValue={'Property Class'}
            rightValue={data.GEN_PROPERTY_CLASS_DESC}
            leftSize={leftColumnSize}
          />
        </Grid>
      ) : (
        <Typography variant="body2">No BC Assessment information available.</Typography>
      )}
    </Box>
  );
};

export default BCAssessmentDetails;
