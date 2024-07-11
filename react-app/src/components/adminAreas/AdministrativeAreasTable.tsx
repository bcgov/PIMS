import React, { MutableRefObject, useContext, useState } from 'react';
import {
  GridColDef,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import usePimsApi from '@/hooks/usePimsApi';
import { dateFormatter } from '@/utilities/formatters';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useNavigate } from 'react-router-dom';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';
import { Box } from '@mui/material';
import { SnackBarContext } from '@/contexts/snackbarContext';

const AdministrativeAreasTable = () => {
  const api = usePimsApi();
  const navigate = useNavigate();
  const snackbar = useContext(SnackBarContext);
  const [totalCount, setTotalCount] = useState(0);

  const handleDataChange = async (filter: any, signal: AbortSignal): Promise<any[]> => {
    try {
      const { data, totalCount } = await api.administrativeAreas.getAdministrativeAreas(filter, signal);
      setTotalCount(totalCount);
      return data;
    } catch (error) {
      setTotalCount(0);
      snackbar.setMessageState({
        open: true,
        text: error.message,
        style: snackbar.styles.warning,
      });
      return [];
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'RegionalDistrictName',
      headerName: 'Regional District',
      flex: 1,
    },
    {
      field: 'IsDisabled',
      headerName: 'Is Disabled',
      flex: 1,
      type: 'boolean',
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
              value: false,
              operator: 'is',
              field: 'IsDisabled',
            },
          ],
        });
        break;
      case 'Disabled':
        ref.current.setFilterModel({
          items: [
            {
              value: true,
              operator: 'is',
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
    <Box height={'calc(100vh - 180px)'}>
      <FilterSearchDataGrid
        dataSource={handleDataChange}
        tableOperationMode="server"
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
        addTooltip={'Create New Administration Area'}
        columns={columns}
        getRowId={(row) => row.Id}
        rowCount={totalCount}
        rowCountProp={totalCount}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 100 } },
          sorting: {
            sortModel: [{ field: 'Name', sort: 'asc' }],
          },
        }}
      />
    </Box>
  );
};

export default AdministrativeAreasTable;
