import React, { MutableRefObject, useContext, useMemo, useState } from 'react';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps, Tooltip, lighten, useTheme } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridColDef, GridColumnHeaderTitle, GridEventListener } from '@mui/x-data-grid';
import { dateFormatter, pidFormatter, zeroPadPID } from '@/utilities/formatters';
import { ClassificationInline } from './ClassificationIcon';
import usePimsApi from '@/hooks/usePimsApi';
import { SnackBarContext } from '@/contexts/snackbarContext';
import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { LookupContext } from '@/contexts/lookupContext';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';
import { exposedProjectStatuses } from '@/constants/projectStatuses';
import './propertyRowStyle.css';
import { getPropertyExportMap } from '@/utilities/getPropertyExportMap';

interface IPropertyTable {
  rowClickHandler: GridEventListener<'rowClick'>;
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
    undefined: {
      textColor: lighten(theme.palette.warning.main, 0.2),
      bgColor: theme.palette.black.main,
    },
  };
};

const PropertyTable = (props: IPropertyTable) => {
  const [totalCount, setTotalCount] = useState(0);
  const api = usePimsApi();
  const { navigateAndSetFrom } = useHistoryAwareNavigate();
  const snackbar = useContext(SnackBarContext);
  const lookup = useContext(LookupContext);

  const classification = useClassificationStyle();
  const theme = useTheme();

  const agenciesForFilter = useMemo(() => {
    if (lookup.data) {
      return lookup.data.Agencies.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  const classificationForFilter = useMemo(() => {
    if (lookup.data) {
      return lookup.data.Classifications.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  const adminAreasForFilter = useMemo(() => {
    if (lookup.data) {
      return lookup.data.AdministrativeAreas.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  const projectStatusesForFilter = useMemo(() => {
    if (lookup.data) {
      return lookup.data.ProjectStatuses.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  const columns: GridColDef[] = [
    {
      field: 'PropertyType',
      headerName: 'Type',
      flex: 1,
      maxWidth: 130,
      type: 'singleSelect',
      valueOptions: ['Parcel', 'Building'],
    },
    {
      field: 'Classification',
      headerName: 'Classification',
      flex: 1,
      minWidth: 200,
      valueOptions: classificationForFilter,
      type: 'singleSelect',
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
            color={classification[params.row.ClassificationId].textColor}
            backgroundColor={classification[params.row.ClassificationId].bgColor}
            title={params.row.Classification ?? ''}
          />
        );
      },
    },
    {
      field: 'ProjectStatus',
      headerName: 'Project Status',
      type: 'singleSelect',
      flex: 1,
      maxWidth: 200,
      valueOptions: projectStatusesForFilter,
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
      type: 'singleSelect',
      valueOptions: agenciesForFilter,
    },
    {
      field: 'Address',
      headerName: 'Main Address',
      flex: 1,
    },
    {
      field: 'AdministrativeArea',
      headerName: 'Administrative Area',
      flex: 1,
      type: 'singleSelect',
      valueOptions: adminAreasForFilter,
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
      case 'Parcel':
        ref.current.setFilterModel({
          items: [{ value, operator: 'is', field: 'PropertyType' }],
        });
        break;
      case 'Core':
        ref.current.setFilterModel({
          items: [
            {
              value: ['Core Operational', 'Core Strategic'],
              operator: 'isAnyOf',
              field: 'Classification',
            },
          ],
        });
        break;
      case 'Surplus':
        ref.current.setFilterModel({
          items: [
            {
              value: ['Surplus Active', 'Surplus Encumbered'],
              operator: 'isAnyOf',
              field: 'Classification',
            },
          ],
        });
        break;
      case 'Disposed':
        ref.current.setFilterModel({
          items: [{ value, operator: 'is', field: 'Classification' }],
        });
        break;
      case 'Approved for ERP':
        ref.current.setFilterModel({
          items: [{ value: value, operator: 'is', field: 'ProjectStatus' }],
        });
        break;
      default:
        ref.current.setFilterModel({ items: [] });
    }
  };

  const excelDataMap = getPropertyExportMap();

  const handleDataChange = async (filter: CommonFiltering, signal: AbortSignal): Promise<any[]> => {
    try {
      const { data, totalCount } = await api.properties.propertiesDataSource(filter, signal);
      setTotalCount(totalCount);
      return data;
    } catch {
      snackbar.setMessageState({
        open: true,
        text: 'Error loading properties.',
        style: snackbar.styles.warning,
      });
      return [];
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
      <Box height={'calc(100vh - 180px)'}>
        <FilterSearchDataGrid
          name="properties"
          dataSource={handleDataChange}
          excelDataSource={api.properties.getPropertiesForExcelExport}
          onPresetFilterChange={selectPresetFilter}
          getRowId={(row) => `${row.Id}_${row.PropertyType}`}
          defaultFilter={'All Properties'}
          tableOperationMode="server"
          onRowClick={props.rowClickHandler}
          onAddButtonClick={() => navigateAndSetFrom('add')}
          presetFilterSelectOptions={[
            <CustomMenuItem key={'All Properties'} value={'All Properties'}>
              All Properties
            </CustomMenuItem>,
            <CustomListSubheader key={'Type'}>Property Type</CustomListSubheader>,
            <CustomMenuItem key={'Building'} value={'Building'}>
              Building
            </CustomMenuItem>,
            <CustomMenuItem key={'Parcel'} value={'Parcel'}>
              Parcel
            </CustomMenuItem>,
            <CustomListSubheader key={'Group'}>Classification Group</CustomListSubheader>,
            <CustomMenuItem key={'Core'} value={'Core'}>
              Core
            </CustomMenuItem>,
            <CustomMenuItem key={'Surplus'} value={'Surplus'}>
              Surplus
            </CustomMenuItem>,
            <CustomMenuItem key={'Disposed'} value={'Disposed'}>
              Disposed
            </CustomMenuItem>,
            <CustomListSubheader key={'Other'}>Other</CustomListSubheader>,
            <CustomMenuItem key={'ERP'} value={'Approved for ERP'}>
              In ERP Project
            </CustomMenuItem>,
          ]}
          tableHeader={'Properties Overview'}
          rowCountProp={totalCount}
          rowCount={totalCount}
          getRowClassName={(params) =>
            exposedProjectStatuses.includes(params.row.ProjectStatusId) ? 'erp-property-row' : ''
          }
          excelTitle={'Properties'}
          customExcelMap={excelDataMap}
          columns={columns}
          addTooltip="Create New Property"
          initialState={{
            columns: {
              columnVisibilityModel: {
                ProjectStatus: false,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PropertyTable;
