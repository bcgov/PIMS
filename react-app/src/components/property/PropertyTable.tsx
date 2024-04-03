import React, { MutableRefObject, useMemo } from 'react';
import { CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps, Tooltip, lighten, useTheme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { Check } from '@mui/icons-material';
import { GridColDef, GridColumnHeaderTitle, GridEventListener } from '@mui/x-data-grid';
import { dateFormatter } from '@/utils/formatters';
import { ClassificationInline } from './ClassificationIcon';
import { useNavigate } from 'react-router-dom';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';

interface IPropertyTable {
  rowClickHandler: GridEventListener<'rowClick'>;
  // data: Record<string, any>[];
  // isLoading: boolean;
  // refreshData: () => void;
  // loadData: () => void;
  // error: unknown;
}

export const useClassificationStyle = () => {
  const theme = useTheme();

  return {
    0: {
      textColor: lighten(theme.palette.success.main, 0.3),
      bgColor: theme.palette.success.light,
    },
    1: { textColor: lighten(theme.palette.blue.main, 0.4), bgColor: theme.palette.blue.light },
    2: { textColor: lighten(theme.palette.info.main, 0.3), bgColor: theme.palette.info.light },
    3: { textColor: lighten(theme.palette.info.main, 0.3), bgColor: theme.palette.info.light },
    4: {
      textColor: lighten(theme.palette.warning.main, 0.2),
      bgColor: theme.palette.warning.light,
    },
    5: {
      textColor: lighten(theme.palette.warning.main, 0.2),
      bgColor: theme.palette.warning.light,
    },
    6: {
      textColor: lighten(theme.palette.warning.main, 0.2),
      bgColor: theme.palette.warning.light,
    },
  };
};

const PropertyTable = (props: IPropertyTable) => {
  const api = usePimsApi();
  const navigate = useNavigate();
  const {
    data: parcels,
    isLoading: parcelsLoading,
    loadOnce: loadParcels,
  } = useDataLoader(api.parcels.getParcels);
  const {
    data: buildings,
    isLoading: buildingsLoading,
    loadOnce: loadBuildings,
  } = useDataLoader(api.buildings.getBuildings);
  const { data: agencies, loadOnce: loadAgencies } = useDataLoader(api.agencies.getAgencies);
  const { data: classifications, loadOnce: loadClassifications } = useDataLoader(
    api.lookup.getClassifications,
  );
  const properties = useMemo(
    () => [
      ...(buildings?.map((b) => ({ ...b, Type: 'Building' })) ?? []),
      ...(parcels?.map((p) => ({ ...p, Type: 'Parcel' })) ?? []),
    ],
    [buildings, parcels],
  );

  const loading = parcelsLoading || buildingsLoading;

  const loadAll = () => {
    loadParcels();
    loadBuildings();
  };

  const classification = useClassificationStyle();
  const theme = useTheme();

  loadAll();
  loadAgencies();
  loadClassifications();

  const columns: GridColDef[] = [
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'ClassificationId',
      headerName: 'Classification',
      flex: 1,
      minWidth: 200,
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
        const classificationName = classifications?.find((cl) => cl.Id === params.value)?.Name;
        return (
          <ClassificationInline
            color={classification[params.row.ClassificationId].textColor}
            backgroundColor={classification[params.row.ClassificationId].bgColor}
            title={classificationName ?? ''}
          />
        );
      },
    },
    {
      field: 'PID',
      headerName: 'PID',
      flex: 1,
      renderCell: (params) => params.value ?? 'N/A',
    },
    {
      field: 'AgencyId',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (params) => agencies?.find((ag) => ag.Id === params.value)?.Name ?? '',
    },
    {
      field: 'Address1',
      headerName: 'Main Address',
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
      renderCell: (params) => (params.value ? `${params.value}%` : ''),
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

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'All Properties':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Building':
      case 'Parcel':
        ref.current.setFilterModel({ items: [{ value, operator: 'contains', field: 'Type' }] });
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
        getRowId={(row) => row.Id + row.Type}
        defaultFilter={'All Properties'}
        onRowClick={props.rowClickHandler}
        onAddButtonClick={() => navigate('add')}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'All Properties'} value={'All Properties'}>
            All Properties
          </CustomMenuItem>,
          <CustomMenuItem key={'Building'} value={'Building'}>
            Buildings
          </CustomMenuItem>,
          <CustomMenuItem key={'Parcel'} value={'Parcel'}>
            Parcels
          </CustomMenuItem>,
        ]}
        loading={loading}
        tableHeader={'Properties Overview'}
        excelTitle={'Properties'}
        columns={columns}
        rows={properties}
        addTooltip="Add a new property"
      />
    </Box>
  );
};

export default PropertyTable;
