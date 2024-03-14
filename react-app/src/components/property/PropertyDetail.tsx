import React, { useEffect, useMemo } from 'react';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { Box, Typography } from '@mui/material';
import DataCard from '../display/DataCard';
import { ClassificationInline } from './ClassificationIcon';
import CollapsibleSidebar from '../layout/CollapsibleSidebar';
import ParcelNetValueTable from './ParcelNetValueTable';
import { PinnedColumnDataGrid } from '../table/DataTable';
import { GridColDef } from '@mui/x-data-grid';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { useClassificationStyle } from './PropertyTable';

interface IPropertyDetail {
  parcelId?: number;
  buildingId?: number;
  onClose: () => void;
}

const PropertyDetail = (props: IPropertyDetail) => {
  const { parcelId, buildingId } = props;
  const api = usePimsApi();
  const { data: parcel, refreshData: refreshParcel } = useDataLoader(() =>
    api.parcels.getParcelById(parcelId),
  );
  const { data: building, refreshData: refreshBuilding } = useDataLoader(() =>
    api.buildings.getBuildingById(buildingId),
  );
  useEffect(() => {
    refreshBuilding();
  }, [buildingId]);

  useEffect(() => {
    refreshParcel();
  }, [parcelId]);
  const classification = useClassificationStyle();
  const assessedValue = [
    {
      FiscalYear: '2024',
      Land: '$2450000',
      Building1: '$350000',
      Building2: '$5000000',
      Building3: '$5000000',
      Building4: '$2000000',
      Building5: '$8090000',
    },
    {
      FiscalYear: '23/22',
      Land: '$2450000',
      Building1: '$350000',
      Building2: '$5000000',
      Building3: '$5000000',
      Building4: '$2000000',
      Building5: '$8090000',
    },
  ];

  const assesValCol: GridColDef[] = [
    {
      field: 'FiscalYear',
      headerName: 'Year',
    },
    {
      field: 'Land',
      headerName: 'Land',
    },
    {
      field: 'Building1',
      headerName: 'Building (1)',
    },
    {
      field: 'Building2',
      headerName: 'Building (2)',
    },
    {
      field: 'Building3',
      headerName: 'Building (3)',
    },
    {
      field: 'Building4',
      headerName: 'Building (4)',
    },
    {
      field: 'Building5',
      headerName: 'Building (5)',
    },
  ];

  const customFormatter = (key: any, val: any) => {
    if (key === 'Agency' && val) {
      return <Typography>{val.Name}</Typography>;
    } else if (key === 'Classification') {
      return (
        <ClassificationInline
          color={classification[val.Id].textColor}
          backgroundColor={classification[val.Id].bgColor}
          title={val.Name}
        />
      );
    } else if (key === 'IsSensitive') {
      return val ? <Typography>Yes</Typography> : <Typography>No</Typography>;
    }
  };

  const buildingOrParcel = building ? 'Building' : 'Parcel';
  const mainInformation = useMemo(() => {
    const data = parcel ?? building;
    if (!data) {
      return {};
    } else {
      return {
        Classification: data.Classification,
        PID: data.PID,
        PIN: data.PIN,
        Address: data.Address1,
        LotSize: data.TotalArea,
        IsSensitive: data.IsSensitive,
        Description: data.Description,
      };
    }
  }, [parcel, building]);
  return (
    <CollapsibleSidebar
      items={[
        { title: `${buildingOrParcel} information` },
        { title: `${buildingOrParcel} net book value` },
        { title: 'Assessed value' },
      ]}
    >
      <Box
        display={'flex'}
        gap={'1rem'}
        mt={'2rem'}
        mb={'2rem'}
        flexDirection={'column'}
        width={'46rem'}
        marginX={'auto'}
      >
        <DetailViewNavigation
          navigateBackTitle={'Back to Property Overview'}
          deleteTitle={`Delete ${buildingOrParcel}`}
          onDeleteClick={() => {}}
          onBackClick={() => props.onClose()}
        />
        <DataCard
          id="Parcel information"
          customFormatter={customFormatter}
          values={mainInformation}
          title={`${buildingOrParcel} information`}
          onEdit={() => {}}
        />
        <DataCard
          id={`${buildingOrParcel} net book value`}
          values={undefined}
          title={`${buildingOrParcel} net book value`}
          onEdit={() => {}}
        >
          <ParcelNetValueTable />
        </DataCard>
        {/* {buildings1.map((building, idx) => {
          return (
            <DataCard
              id={`Building information (${idx + 1})`}
              key={'building' + idx}
              values={building}
              title={`Building information (${idx + 1})`}
              onEdit={() => {}}
            />
          );
        })} */}
        <DataCard
          id={'Assessed value'}
          values={undefined}
          title={'Assessed value'}
          onEdit={() => {}}
        >
          <PinnedColumnDataGrid
            hideFooter
            getRowId={(row) => row.FiscalYear}
            pinnedFields={['FiscalYear', 'Land']}
            columns={assesValCol}
            rows={assessedValue}
            scrollableSxProps={{
              borderStyle: 'none',
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: 'none',
              },
              '& div div div div >.MuiDataGrid-cell': {
                borderBottom: 'none',
                borderTop: '1px solid rgba(224, 224, 224, 1)',
              },
            }}
            pinnedSxProps={{
              borderStyle: 'none',
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: 'none',
              },
              '& div div div div >.MuiDataGrid-cell': {
                borderBottom: 'none',
              },
            }}
          />
        </DataCard>
      </Box>
    </CollapsibleSidebar>
  );
};

export default PropertyDetail;
