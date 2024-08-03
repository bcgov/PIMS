import React, { useContext, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import usePimsApi from '@/hooks/usePimsApi';
import { dateFormatter } from '@/utilities/formatters';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';
import { Box } from '@mui/material';
import { SnackBarContext } from '@/contexts/snackbarContext';
import { LookupContext } from '@/contexts/lookupContext';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';

const AdministrativeAreasTable = () => {
  const api = usePimsApi();
  const { navigateAndSetFrom } = useHistoryAwareNavigate();

  const snackbar = useContext(SnackBarContext);
  const lookup = useContext(LookupContext);
  const [totalCount, setTotalCount] = useState(0);

  const handleDataChange = async (filter: any, signal: AbortSignal): Promise<any[]> => {
    try {
      const { data, totalCount } = await api.administrativeAreas.getAdministrativeAreas(
        filter,
        signal,
      );
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

  // const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
  //   switch (value) {
  //     case 'Enabled':
  //       ref.current.setFilterModel({
  //         items: [
  //           {
  //             value: 'false',
  //             operator: 'is',
  //             field: 'IsDisabled',
  //           },
  //         ],
  //       });
  //       break;
  //     case 'Disabled':
  //       ref.current.setFilterModel({
  //         items: [
  //           {
  //             value: 'true',
  //             operator: 'is',
  //             field: 'IsDisabled',
  //           },
  //         ],
  //       });
  //       break;
  //     default:
  //       ref.current.setFilterModel({ items: [] });
  //   }
  // };

  const presetFilterMapping = {
    Enabled: {
      items: [
        {
          value: 'false',
          operator: 'is',
          field: 'IsDisabled',
        },
      ],
    },
    Disabled: {
      items: [
        {
          value: 'true',
          operator: 'is',
          field: 'IsDisabled',
        },
      ],
    },
  };

  const excelDataMap = (data: AdministrativeArea[]) => {
    return data.map((adminArea) => {
      return {
        Name: adminArea.Name,
        'Regional District': lookup.getLookupValueById(
          'RegionalDistricts',
          adminArea.RegionalDistrictId,
        )?.Name,
        'Created On': adminArea.CreatedOn,
        Disabled: adminArea.IsDisabled,
      };
    });
  };

  return (
    <Box height={'calc(100vh - 180px)'}>
      <FilterSearchDataGrid
        dataSource={handleDataChange}
        tableOperationMode="server"
        name="adminAreas"
        onRowClick={(params) => navigateAndSetFrom(`${params.row.Id}`)}
        presetFilterMapping={presetFilterMapping}
        defaultFilter={'All'}
        onAddButtonClick={() => navigateAndSetFrom('add')}
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
        customExcelMap={excelDataMap}
        addTooltip={'Create New Administration Area'}
        columns={columns}
        getRowId={(row) => row.Id}
        rowCount={totalCount}
        rowCountProp={totalCount}
      />
    </Box>
  );
};

export default AdministrativeAreasTable;
