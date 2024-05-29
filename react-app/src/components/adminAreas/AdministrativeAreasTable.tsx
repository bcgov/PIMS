import React, { MutableRefObject } from 'react';
import {
  GridColDef,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { dateFormatter } from '@/utilities/formatters';
import { Check } from '@mui/icons-material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useNavigate } from 'react-router-dom';
import { RegionalDistrict } from '@/hooks/api/useLookupApi';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';

const AdministrativeAreasTable = () => {
  const api = usePimsApi();
  const navigate = useNavigate();
  const { data, loadOnce } = useDataLoader(api.administrativeAreas.getAdministrativeAreas);
  loadOnce();
  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'RegionalDistrict',
      headerName: 'Regional District',
      flex: 1,
      valueGetter: (value: RegionalDistrict) => value?.Name ?? 'N/A',
    },
    {
      field: 'IsDisabled',
      headerName: 'Is Disabled',
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return <Check />;
        } else return <></>;
      },
    },
    {
      field: 'CreatedOn',
      headerName: 'Created On',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
      type: 'date',
    },
  ];

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'All':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Enabled':
        ref.current.setFilterModel({
          items: [
            {
              value: 'false',
              operator: 'equals',
              field: 'IsDisabled',
            },
          ],
        });
        break;
      case 'Disabled':
        ref.current.setFilterModel({
          items: [
            {
              value: 'true',
              operator: 'equals',
              field: 'IsDisabled',
            },
          ],
        });
        break;
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
        const areaModel = model as AdministrativeArea;
        return {
          id,
          model: {
            Name: areaModel.Name,
            'Regional District': areaModel.RegionalDistrict?.Name ?? '',
            'Created On': areaModel.CreatedOn,
            Disabled: areaModel.IsDisabled,
          },
        };
      });
    }
    return [];
  };

  return (
    <FilterSearchDataGrid
      name="adminAreas"
      onRowClick={(params) => navigate(`${params.row.Id}`)}
      onPresetFilterChange={selectPresetFilter}
      defaultFilter={'All'}
      onAddButtonClick={() => navigate('add')}
      presetFilterSelectOptions={[
        <CustomMenuItem key={'All'} value={'All'}>
          All Areas
        </CustomMenuItem>,
        <CustomListSubheader key={'Status'}>Disabled Status</CustomListSubheader>,
        <CustomMenuItem key={'Enabled'} value={'Enabled'}>
          Enabled
        </CustomMenuItem>,
        <CustomMenuItem key={'Disabled'} value={'Disabled'}>
          Disabled
        </CustomMenuItem>,
      ]}
      tableHeader={'Administrative Areas Overview'}
      excelTitle={'Administrative Areas Table'}
      customExcelData={getExcelData}
      addTooltip={'Create New Admin Area'}
      columns={columns}
      getRowId={(row) => row.Id}
      rows={data ?? []}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 },
        },
        sorting: {
          sortModel: [{ field: 'Name', sort: 'asc' }],
        },
      }}
    />
  );
};

export default AdministrativeAreasTable;
