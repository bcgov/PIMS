import React from 'react';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { Box, Typography, useTheme } from '@mui/material';
import DataCard from '../display/DataCard';
import { ClassificationInline } from './ClassificationIcon';
import CollapsibleSidebar from '../layout/CollapsibleSidebar';
import ParcelNetValueTable from './ParcelNetValueTable';
import { PinnedColumnDataGrid } from '../table/DataTable';
import { GridColDef } from '@mui/x-data-grid';

const PropertyDetail = () => {
  const buildings1 = [
    {
      Id: 1,
      ClassificationId: 0,
      BuildingName: 'Aqua Center',
    },
    {
      Id: 2,
      ClassificationId: 1,
      BuildingName: 'Hydraulic Press',
    },
    {
      Id: 3,
      ClassificationId: 2,
      BuildingName: 'Iron Processing',
    },
    {
      Id: 7,
      ClassificationId: 2,
      BuildingName: 'St. Patricks Building',
    },
  ];

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

  const data = {
    //Id: 1,
    PID: '010-113-1332',
    Classification: 1,
    Agency: { Name: 'Smith & Weston' },
    Address: '1450 Whenever Pl',
    ProjectNumbers: 'FX1234',
    Corporation: 'asdasda',
    Ownership: 'BC Gov',
    Sensitive: true,
    UpdatedOn: new Date(),
  };
  const theme = useTheme();
  const classificationColorMap = {
    0: {
      textColor: theme.palette.blue.main,
      bgColor: theme.palette.blue.light,
      text: 'Core operational',
    },
    1: {
      textColor: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      text: 'Core strategic',
    },
    2: { textColor: theme.palette.info.main, bgColor: theme.palette.info.light, text: 'Surplus' },
    3: { textColor: theme.palette.info.main, bgColor: theme.palette.info.light, text: 'Surplus' },
    4: {
      textColor: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      text: 'Disposal',
    },
    5: {
      textColor: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      text: 'Disposal',
    },
    6: {
      textColor: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      text: 'Disposal',
    },
  };

  const customFormatter = (key: any, val: any) => {
    if (key === 'Agency' && val) {
      return <Typography>{val.Name}</Typography>;
    } else if (key === 'Classification') {
      return (
        <ClassificationInline
          color={classificationColorMap[val].textColor}
          backgroundColor={classificationColorMap[val].bgColor}
          title={classificationColorMap[val].text}
        />
      );
    } else if (key === 'Sensitive') {
      return val ? <Typography>Yes</Typography> : <Typography>No</Typography>;
    }
  };

  return (
    <CollapsibleSidebar
      items={[
        { title: 'Parcel information' },
        { title: 'Parcel net book value' },
        ...buildings1.map((a, idx) => ({
          title: `Building information (${idx + 1})`,
          subTitle: a.BuildingName,
        })),
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
          deleteTitle={'Delete Property'}
          onDeleteClick={() => {}}
          onBackClick={() => {}}
        />
        <DataCard
          id="Parcel information"
          customFormatter={customFormatter}
          values={data}
          title={'Parcel information'}
          onEdit={() => {}}
        />
        <DataCard
          id="Parcel net book value"
          values={undefined}
          title={'Parcel net book value'}
          onEdit={() => {}}
        >
          <ParcelNetValueTable />
        </DataCard>
        {buildings1.map((building, idx) => {
          return (
            <DataCard
              id={`Building information (${idx + 1})`}
              key={'building' + idx}
              values={building}
              title={`Building information (${idx + 1})`}
              onEdit={() => {}}
            />
          );
        })}
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
