import React, { MutableRefObject, useMemo } from 'react';
import { CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps, Tooltip, lighten, useTheme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { Check } from '@mui/icons-material';
import {
  GridColDef,
  GridColumnHeaderTitle,
  GridEventListener,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { dateFormatter } from '@/utilities/formatters';
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
      valueGetter: (value: PropertyType) => value.Name,
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
        //const classificationName = classifications?.find((cl) => cl.Id === params.value)?.Name;
        return (
          <ClassificationInline
            color={classification[params.row.ClassificationId].textColor}
            backgroundColor={classification[params.row.ClassificationId].bgColor}
            title={params.row.Classification.Name}
          />
        );
      },
      valueGetter: (value: Classification) => value.Name,
    },
    {
      field: 'PID',
      headerName: 'PID',
      flex: 1,
      valueGetter: (value: number | null) => (value ? String(value).padStart(9, '0') : 'N/A'),
      renderCell: (params) => {
        if (params.value !== 'N/A') {
          return params.value.match(/\d{3}/g).join('-');
        }
        return params.value;
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (value: Agency) => value.Name,
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
      valueGetter: (value: AdministrativeArea) => value.Name,
    },
    {
      field: 'IsSensitive',
      headerName: 'Sensitive',
      renderCell: (value) => {
        if (value) {
          return <Check />;
        } else return <></>;
      },
      flex: 1,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Last Update',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
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

  const getExcelData: (
    ref: MutableRefObject<GridApiCommunity>,
  ) => Promise<{ id: GridRowId; model: GridValidRowModel }[]> = async (
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    if (ref?.current) {
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
        customExcelData={getExcelData}
        columns={columns}
        rows={properties}
        addTooltip="Add a new property"
      />
    </Box>
  );
};

export default PropertyTable;
