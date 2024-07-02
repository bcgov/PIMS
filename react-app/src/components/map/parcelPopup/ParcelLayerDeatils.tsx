import { GridColumnPair } from '@/components/common/GridHelpers';
import MetresSquared from '@/components/text/MetresSquared';
import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

interface ParcelLayerDetailsProps {
  parcel: ParcelData;
  width?: string | number;
}

/**
 * Renders the details of a parcel layer.
 *
 * @param {ParcelLayerDetailsProps} props - The props for the component.
 * @param {ParcelData} props.parcel - The parcel data to display.
 * @returns {JSX.Element} The rendered component.
 */
const ParcelLayerDetails = (props: ParcelLayerDetailsProps) => {
  const { parcel, width } = props;
  return (
    <Box minWidth={width}>
      <Grid container gap={1}>
        {parcel ? (
          <>
            <GridColumnPair leftValue={'Class'} rightValue={parcel.PARCEL_CLASS} />
            <GridColumnPair leftValue={'Plan Number'} rightValue={parcel.PLAN_NUMBER} />
            <GridColumnPair leftValue={'Owner Type'} rightValue={parcel.OWNER_TYPE} />
            <GridColumnPair
              leftValue={'Municipality'}
              rightValue={parcel.MUNICIPALITY}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Regional District'}
              rightValue={parcel.REGIONAL_DISTRICT}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Area'}
              rightValue={
                <>
                  <span>{`${parcel.FEATURE_AREA_SQM}`}</span>
                  <MetresSquared />
                </>
              }
            />
          </>
        ) : (
          <Typography variant="body2">No parcel data available.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ParcelLayerDetails;
