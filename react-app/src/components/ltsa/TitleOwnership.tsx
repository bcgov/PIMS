import usePimsApi from '@/hooks/usePimsApi';
import DataCard from '../display/DataCard';
import React, { useEffect } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import LtsaOwnershipTable from './LtsaOwnershipTable';
import LtsaChargeTable from './LtsaChargeTable';
import { Box, Typography } from '@mui/material';
import { dateFormatter } from '@/utilities/formatters';

interface TitleOwnershipProps {
  pid: string;
}

const TitleOwnership = (props: TitleOwnershipProps) => {
  const api = usePimsApi();
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.ltsa.getLtsabyPid(Number(props.pid)),
  );

  useEffect(() => {
    refreshData();
  }, []);

  if (!data?.order)
    return (
      <Box display={'flex'} justifyContent={'center'}>
        <Typography sx={{ fontSize: '1.5rem' }}>
          <b>No LTSA information available for this parcel.</b>
        </Typography>
      </Box>
    );

  const TitleDetails = {
    TitleNumber: data?.order?.productOrderParameters.titleNumber,
    LegalDescription:
      data?.order?.orderedProduct?.fieldedData.descriptionsOfLand[0]?.fullLegalDescription,
    TitleStatus: data?.order?.status,
    SalesHistory: data?.order?.orderedProduct?.fieldedData.tombstone?.marketValueAmount,
    ApplicationReceived: dateFormatter(
      data?.order?.orderedProduct?.fieldedData.tombstone?.applicationReceivedDate,
    ),
    EnteredOn: dateFormatter(data?.order?.orderedProduct?.fieldedData.tombstone?.enteredDate),
  };

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <DataCard
        titleTypographyProps={{ variant: 'h3' }}
        loading={isLoading}
        values={TitleDetails}
        title={'Title Details'}
        disableEdit={true}
        onEdit={undefined}
      />
      <DataCard
        titleTypographyProps={{ variant: 'h3' }}
        loading={isLoading}
        values={undefined}
        title={'Ownership Information by Interest Fraction'}
        disableEdit={true}
        onEdit={undefined}
      >
        <LtsaOwnershipTable rows={data?.order.orderedProduct.fieldedData.ownershipGroups} />
      </DataCard>
      <DataCard
        titleTypographyProps={{ variant: 'h3' }}
        loading={isLoading}
        values={undefined}
        title={'Charge Details'}
        disableEdit={true}
        onEdit={undefined}
      >
        <LtsaChargeTable rows={data?.order.orderedProduct.fieldedData.chargesOnTitle} />
      </DataCard>
    </Box>
  );
};

export default TitleOwnership;
