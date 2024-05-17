import usePimsApi from '@/hooks/usePimsApi';
import DataCard from '../display/DataCard';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useDataLoader from '@/hooks/useDataLoader';
import { Box } from '@mui/material';
import LtsaOwnershipTable from './LtsaOwnershipTable';
import LtsaChargeTable from './LtsaChargeTable';

const TitleOwnership = () => {
  const { pid } = useParams();
  const api = usePimsApi();
  const { data, refreshData, isLoading } = useDataLoader(() => api.ltsa.getLtsabyPid(Number(pid)));

  useEffect(() => {
    refreshData();
  }, []);

  const TitleDetails = {
    TitleNumber: data?.order.productOrderParameters.titleNumber,
    LegalDescription:
      data?.order.orderedProduct.fieldedData.descriptionsOfLand[0]?.fullLegalDescription,
    TitleStatus: data?.order.status,
    SalesHistory: data?.order.orderedProduct.fieldedData.tombstone?.marketValueAmount,
    ApplicationReceived: data?.order.orderedProduct.fieldedData.tombstone?.applicationReceivedDate,
    EnteredOn: data?.order.orderedProduct.fieldedData.tombstone?.enteredDate,
  };

  // const ownershipDetails = {
  //   jointTenancyIndication:
  //     data?.order.orderedProduct.fieldedData.ownershipGroups[0]?.jointTenancyIndication || false,
  //   interestFractionNumerator:
  //     data?.order.orderedProduct.fieldedData.ownershipGroups[0]?.interestFractionNumerator || '',
  //   interestFractionDenominator:
  //     data?.order.orderedProduct.fieldedData.ownershipGroups[0]?.interestFractionDenominator || '',
  //   titleOwners:
  //     data?.order.orderedProduct.fieldedData.ownershipGroups.map((group) => ({
  //       lastNameOrCorpName1: group.titleOwners[0].lastNameOrCorpName1,
  //       givenName: group.titleOwners[0].givenName,
  //       incorporationNumber: group.titleOwners[0].incorporationNumber,
  //     })) || [],
  // };

  // const chargeDetails = {
  //   rows: [],
  //   length: data?.order.orderedProduct.fieldedData.chargesOnTitle?.length || 0,
  //   chargeNumber: data?.order.orderedProduct.fieldedData.chargesOnTitle[0]?.chargeNumber,
  //   status: data?.order.orderedProduct.fieldedData.chargesOnTitle[0]?.status,
  //   enteredDate: data?.order.orderedProduct.fieldedData.chargesOnTitle[0]?.enteredDate,
  //   chargeRemarks: data?.order.orderedProduct.fieldedData.chargesOnTitle[0]?.chargeRemarks,
  //   interAlia: data?.order.orderedProduct.fieldedData.chargesOnTitle[0]?.interAlia,
  //   charge: data?.order.orderedProduct.fieldedData.chargesOnTitle?.map((group) => ({
  //     receivedDate: group.charge.applicationReceivedDate,
  //     chargeNumber: group.charge.chargeNumber,
  //     transactionType: group.charge.transactionType,
  //     chargeOwnershipGroups: group.charge.chargeOwnershipGroups,
  //   })),
  //   chargeRelease: {},
  // };

  return (
    <>
      <Box
        display={'flex'}
        gap={'1rem'}
        mt={'2rem'}
        flexDirection={'column'}
        width={'46rem'}
        marginX={'auto'}
      ></Box>
      <DataCard
        loading={isLoading}
        values={TitleDetails}
        title={'Title Details'}
        disableEdit={true}
        onEdit={undefined}
      />
      <DataCard
        loading={isLoading}
        values={undefined}
        title={'Ownership Information by Interest Fraction'}
        disableEdit={true}
        onEdit={undefined}
      >
        <LtsaOwnershipTable rows={data?.order.orderedProduct.fieldedData.ownershipGroups} />
      </DataCard>
      <DataCard
        loading={isLoading}
        values={undefined}
        title={'Charge Details'}
        disableEdit={true}
        onEdit={undefined}
      >
        <LtsaChargeTable rows={data?.order.orderedProduct.fieldedData.chargesOnTitle} />
      </DataCard>
    </>
  );
};

export default TitleOwnership;
