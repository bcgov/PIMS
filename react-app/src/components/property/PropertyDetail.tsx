import React from 'react';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { Box, Typography, useTheme } from '@mui/material';
import DataCard from '../display/DataCard';
import { ClassificationInline } from './ClassificationIcon';

const PropertyDetail = () => {
  const buildings1 = [
    {
      Id: 1,
      ClassificationId: 0,
    },
    {
      Id: 2,
      ClassificationId: 1,
    },
    {
      Id: 3,
      ClassificationId: 2,
    },
    {
      Id: 7,
      ClassificationId: 2,
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
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
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
        customFormatter={customFormatter}
        values={data}
        title={'Parcel information'}
        onEdit={() => {}}
      />
      {buildings1.map((building, idx) => {
        return (
          <DataCard
            key={'building' + idx}
            values={building}
            title={`Building information (${idx + 1})`}
            onEdit={() => {}}
          />
        );
      })}
    </Box>
  );
};

export default PropertyDetail;
