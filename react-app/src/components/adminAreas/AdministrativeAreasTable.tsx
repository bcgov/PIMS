import React, { MutableRefObject } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { dateFormatter } from '@/utils/formatters';
import { Check } from '@mui/icons-material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

const AdministrativeAreasTable = () => {
  const api = usePimsApi();
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
      valueGetter: (params) => params.value?.Name ?? 'N/A',
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
      headerName: 'CreatedOn',
      flex: 1,
      valueFormatter: (params) => dateFormatter(params.value),
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

  return (
    <FilterSearchDataGrid
      onPresetFilterChange={selectPresetFilter}
      defaultFilter={'All'}
      presetFilterSelectOptions={[
        <CustomMenuItem key={'All'} value={'All'}>
          All Areas
        </CustomMenuItem>,
        <CustomMenuItem key={'Enabled'} value={'Enabled'}>
          Enabled
        </CustomMenuItem>,
        <CustomMenuItem key={'Disabled'} value={'Disabled'}>
          Disabled
        </CustomMenuItem>,
      ]}
      tableHeader={'Administrative Areas'}
      excelTitle={'Administrative Areas Table'}
      addTooltip={'Add admin area'}
      columns={columns}
      getRowId={(row) => row.Id}
      rows={data ?? []}
    />
  );
};

export default AdministrativeAreasTable;
