import React, { MutableRefObject, useContext, useMemo } from 'react';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps, Tooltip, lighten, useTheme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import {
  GridColDef,
  GridColumnHeaderTitle,
  GridEventListener,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { dateFormatter, pidFormatter, zeroPadPID } from '@/utilities/formatters';
import { ClassificationInline } from './ClassificationIcon';
import { useNavigate } from 'react-router-dom';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Parcel, ParcelEvaluation, ParcelFiscal } from '@/hooks/api/useParcelsApi';
import {
  Building,
  BuildingEvaluation,
  BuildingFiscal,
  PropertyType,
} from '@/hooks/api/useBuildingsApi';
import { propertyTypeMapper, PropertyTypes } from '@/constants/propertyTypes';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';
import { Agency } from '@/hooks/api/useAgencyApi';
import { Classification } from '@/hooks/api/useLookupApi';
import { SnackBarContext } from '@/contexts/snackbarContext';

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
  const snackbar = useContext(SnackBarContext);
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

  const properties = useMemo(
    () => [
      ...(buildings?.map((b) => ({ ...b, Type: 'Building' })) ?? []),
      ...(parcels?.map((p) => ({ ...p, Type: 'Parcel' })) ?? []),
    ],
    [buildings, parcels],
  );

  const loading = parcelsLoading || buildingsLoading;

  const loadAll = () => {
    loadParcels({ includeRelations: true });
    loadBuildings({ includeRelations: true });
  };

  const classification = useClassificationStyle();
  const theme = useTheme();

  loadAll();

  const columns: GridColDef[] = [
    {
      field: 'PropertyType',
      headerName: 'Type',
      flex: 1,
      maxWidth: 130,
      valueGetter: (value?: PropertyType) => value?.Name,
    },
    {
      field: 'Classification',
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
        return (
          <ClassificationInline
            color={classification[params.row.Classification.Id].textColor}
            backgroundColor={classification[params.row.Classification.Id].bgColor}
            title={params.row.Classification?.Name ?? ''}
          />
        );
      },
      valueGetter: (value?: Classification) => value?.Name,
    },
    {
      field: 'PID',
      headerName: 'PID',
      flex: 1,
      maxWidth: 150,
      // This odd logic is to allow for search with or without hyphens.
      // It concatinates a non-hyphenated and hyphenated version together for searching, then uses the second for presentation.
      valueGetter: (value: number | null) =>
        value ? `${zeroPadPID(value)},${pidFormatter(zeroPadPID(value))}` : 'N/A',
      renderCell: (params) => (params.value !== 'N/A' ? params.value.split(',').at(1) : 'N/A'),
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (value?: Agency) => value?.Name,
    },
    {
      field: 'Address1',
      headerName: 'Main Address',
      flex: 1,
    },
    {
      field: 'AdministrativeArea',
      headerName: 'Administrative Area',
      flex: 1,
      valueGetter: (value?: AdministrativeArea) => value?.Name,
    },
    {
      field: 'LandArea',
      headerName: 'Land Area',
      width: 120,
      valueFormatter: (value) => (value ? `${(value as number).toFixed(2)} ha` : ''),
    },
    {
      field: 'UpdatedOn',
      headerName: 'Updated On',
      flex: 1,
      maxWidth: 125,
      valueFormatter: (value) => dateFormatter(value),
      type: 'date',
    },
  ];

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'All Properties':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Building':
      case 'Land':
        ref.current.setFilterModel({
          items: [{ value, operator: 'contains', field: 'PropertyType' }],
        });
        break;
      default:
        ref.current.setFilterModel({ items: [] });
    }
  };

  const getExcelData: (
    ref: MutableRefObject<GridApiCommunity>,
  ) => Promise<{ id: GridRowId; model: GridValidRowModel }[]> = async (
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    if (ref?.current) {
      try {
        const buildingsWithExtras = await api.buildings.getBuildings({
          includeRelations: true,
          excelExport: true,
        });
        const parcelsWithExtras = await api.parcels.getParcels({
          includeRelations: true,
          excelExport: true,
        });

        if (!buildingsWithExtras || !parcelsWithExtras) {
          throw new Error('Buildings or Parcels could not be reached. Refresh and try again.');
        }
        const properties = [
          ...(buildingsWithExtras?.map((b) => ({ ...b, Type: 'Building' })) ?? []),
          ...(parcelsWithExtras?.map((p) => ({ ...p, Type: 'Parcel' })) ?? []),
        ];
        ref.current.setRows(properties);
        const rows = gridFilteredSortedRowEntriesSelector(ref);
        return rows.map((row) => {
          const { id, model } = row;
          const propertyModel = model as Parcel | Building;
          return {
            id,
            model: {
              Type: propertyTypeMapper(propertyModel.PropertyTypeId),
              Classification: propertyModel.Classification?.Name,
              Name: propertyModel.Name,
              Description: propertyModel.Description,
              Ministry: propertyModel.Agency?.Parent?.Name,
              Agency: propertyModel.Agency?.Name,
              Address: propertyModel.Address1,
              'Administrative Area': propertyModel.AdministrativeArea?.Name,
              Postal: propertyModel.Postal,
              PID: propertyModel.PID,
              PIN: propertyModel.PIN,
              'Assessed Value': propertyModel.Evaluations?.length
                ? propertyModel.Evaluations.sort(
                    (
                      a: ParcelEvaluation | BuildingEvaluation,
                      b: ParcelEvaluation | BuildingEvaluation,
                    ) => b.Year - a.Year,
                  ).at(0).Value
                : '',
              'Assessment Year': propertyModel.Evaluations?.length
                ? propertyModel.Evaluations.sort(
                    (
                      a: ParcelEvaluation | BuildingEvaluation,
                      b: ParcelEvaluation | BuildingEvaluation,
                    ) => b.Year - a.Year,
                  ).at(0).Year
                : '',
              'Netbook Value': propertyModel.Fiscals?.length
                ? propertyModel.Fiscals.sort(
                    (a: ParcelFiscal | BuildingFiscal, b: ParcelFiscal | BuildingFiscal) =>
                      b.FiscalYear - a.FiscalYear,
                  ).at(0).Value
                : '',
              'Netbook Year': propertyModel.Fiscals?.length
                ? propertyModel.Fiscals.sort(
                    (a: ParcelFiscal | BuildingFiscal, b: ParcelFiscal | BuildingFiscal) =>
                      b.FiscalYear - a.FiscalYear,
                  ).at(0).FiscalYear
                : '',
              'Parcel Land Area':
                propertyModel.PropertyTypeId === PropertyTypes.LAND
                  ? (propertyModel as Parcel).LandArea
                  : '',
              'Building Total Area':
                propertyModel.PropertyTypeId === PropertyTypes.BUILDING
                  ? (propertyModel as Building).TotalArea
                  : '',
              'Building Predominate Use':
                propertyModel.PropertyTypeId === PropertyTypes.BUILDING
                  ? (propertyModel as Building).BuildingPredominateUse?.Name
                  : '',
              'Building Construction Type':
                propertyModel.PropertyTypeId === PropertyTypes.BUILDING
                  ? (propertyModel as Building).BuildingConstructionType?.Name
                  : '',
              'Building Tenancy':
                propertyModel.PropertyTypeId === PropertyTypes.BUILDING
                  ? (propertyModel as Building).BuildingTenancy
                  : '',
            },
          };
        });
      } catch (e) {
        snackbar.setMessageState({
          open: true,
          style: snackbar.styles.warning,
          text: e.message ?? 'Error exporting Excel file.',
        });
        return [];
      }
    }
    return [];
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
        name="properties"
        onPresetFilterChange={selectPresetFilter}
        getRowId={(row) => row.Id + row.Type}
        defaultFilter={'All Properties'}
        onRowClick={props.rowClickHandler}
        onAddButtonClick={() => navigate('add')}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'All Properties'} value={'All Properties'}>
            All Properties
          </CustomMenuItem>,
          <CustomListSubheader key={'Type'}>Property Type</CustomListSubheader>,
          <CustomMenuItem key={'Building'} value={'Building'}>
            Building
          </CustomMenuItem>,
          <CustomMenuItem key={'Land'} value={'Land'}>
            Land
          </CustomMenuItem>,
        ]}
        loading={loading}
        tableHeader={'Properties Overview'}
        excelTitle={'Properties'}
        customExcelData={getExcelData}
        columns={columns}
        rows={properties}
        addTooltip="Create New Property"
        initialState={{
          sorting: {
            sortModel: [{ sort: 'desc', field: 'UpdatedOn' }],
          },
        }}
      />
    </Box>
  );
};

export default PropertyTable;
