import React, { MutableRefObject } from 'react';
import { CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps, Tooltip, lighten, useTheme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { Check } from '@mui/icons-material';
import { GridColDef, GridColumnHeaderTitle } from '@mui/x-data-grid';
import { dateFormatter } from '@/utils/formatters';
import { ClassificationInline, ClassificationIcon } from './ClassificationIcon';

const PropertyTable = () => {
  const theme = useTheme();

  const classificationColorMap = {
    0: { textColor: theme.palette.blue.main, bgColor: theme.palette.blue.light },
    1: { textColor: theme.palette.success.main, bgColor: theme.palette.success.light },
    2: { textColor: theme.palette.info.main, bgColor: theme.palette.info.light },
    3: { textColor: theme.palette.info.main, bgColor: theme.palette.info.light },
    4: { textColor: theme.palette.warning.main, bgColor: theme.palette.warning.light },
    5: { textColor: theme.palette.warning.main, bgColor: theme.palette.warning.light },
    6: { textColor: theme.palette.warning.main, bgColor: theme.palette.warning.light },
  };

  const columns: GridColDef[] = [
    {
      field: 'PID',
      headerName: 'PID',
      flex: 1,
    },
    {
      field: 'ClassificationId',
      headerName: 'Classification',
      flex: 1,
      minWidth: 260,
      renderHeader: (params) => {
        return (
          <Tooltip
            title={
              <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
                <ClassificationInline
                  title="Core operational"
                  color={lighten(theme.palette.success.main, 0.3)}
                  backgroundColor={theme.palette.success.light}
                />
                <ClassificationInline
                  title="Core strategic"
                  color={lighten(theme.palette.blue.main, 0.4)}
                  backgroundColor={theme.palette.blue.light}
                />
                <ClassificationInline
                  title="Surplus"
                  color={lighten(theme.palette.info.main, 0.3)}
                  backgroundColor={theme.palette.info.light}
                />
                <ClassificationInline
                  title="Disposed"
                  color={lighten(theme.palette.warning.main, 0.2)}
                  backgroundColor={theme.palette.warning.light}
                />
              </Box>
            }
          >
            <div>
              <GridColumnHeaderTitle columnWidth={0} label={'Classification'} {...params} />
            </div>
          </Tooltip>
        );
      },
      renderCell: (params) => {
        const reduced = params.row.Buildings.reduce((acc, curr) => {
          const colorKey = classificationColorMap[curr.ClassificationId].bgColor;
          if (!acc[colorKey]) {
            acc[colorKey] = 1;
          } else {
            acc[colorKey]++;
          }
          return acc;
        }, {});
        return (
          <Box display={'flex'} gap={'12px'}>
            <ClassificationIcon
              iconType="parcel"
              amount={1}
              textColor={classificationColorMap[params.row.ClassificationId].textColor}
              backgroundColor={classificationColorMap[params.row.ClassificationId].bgColor}
            />
            {Object.entries(reduced).map(([key, val]) => (
              <ClassificationIcon
                key={`buildingparcelicon${key}`}
                iconType="building"
                amount={Number(val)}
                textColor={
                  Object.values(classificationColorMap).find((c) => c.bgColor === key).textColor
                }
                backgroundColor={key}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (params) => params.value?.Name ?? '',
    },
    {
      field: 'Address1',
      headerName: 'Main Address',
      flex: 1,
    },
    {
      field: 'ProjectNumbers', // right field??
      headerName: 'Title Number',
      flex: 1,
    },
    {
      field: 'Corporation',
      headerName: 'Corporation',
      flex: 1,
    },
    {
      field: 'Ownership',
      headerName: 'Ownership',
      flex: 1,
    },
    {
      field: 'IsSensitive',
      headerName: 'Sensitive',
      renderCell: (params) => {
        if (params.value) {
          return <Check />;
        } else return <></>;
      },
      flex: 1,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Last Update',
      flex: 1,
      valueFormatter: (params) => dateFormatter(params.value),
    },
  ];

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

  const buildings2 = [
    {
      Id: 4,
      ClassificationId: 3,
    },
    {
      Id: 5,
      ClassificationId: 4,
    },
    {
      Id: 6,
      ClassificationId: 5,
    },
    {
      Id: 8,
      ClassificationId: 5,
    },
  ];

  const rows = [
    {
      Id: 1,
      PID: '010-113-1332',
      ClassificationId: 1,
      AgencyId: 1,
      Agency: { Name: 'Smith & Weston' },
      Address1: '1450 Whenever Pl',
      ProjectNumbers: 'FX1234',
      Corporation: 'asdasda',
      Ownership: 'BC Gov',
      IsSensitive: true,
      UpdatedOn: new Date(),
      Buildings: buildings1,
    },
    {
      Id: 2,
      PID: '330-11-4335',
      ClassificationId: 2,
      AgencyId: 2,
      Agency: { Name: 'Burger King' },
      Address1: '1143 Bigapple Rd',
      ProjectNumbers: 'FX121a4',
      Corporation: 'Big Corp',
      Ownership: 'BC Gov',
      IsSensitive: false,
      UpdatedOn: new Date(),
      Buildings: buildings2,
    },
  ];

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'All Properties':
        ref.current.setFilterModel({ items: [] });
        break;
      default:
        ref.current.setFilterModel({ items: [] });
    }
  };

  return (
    <Box
      sx={
        {
          padding: '24px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        } as SxProps
      }
    >
      <FilterSearchDataGrid
        onPresetFilterChange={selectPresetFilter}
        getRowId={(row) => row.Id}
        defaultFilter={'All Properties'}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'All Properties'} value={'All Properties'}>
            All Properties
          </CustomMenuItem>,
        ]}
        tableHeader={'Properties Overview'}
        excelTitle={'Properties'}
        columns={columns}
        rows={rows}
        addTooltip="Add a new property"
      />
    </Box>
  );
};

export default PropertyTable;
