import React, { MutableRefObject, useContext, useMemo, useState } from 'react';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, Chip, SxProps } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridColDef, GridEventListener } from '@mui/x-data-grid';
import { dateFormatter } from '@/utilities/formatters';
import { Agency } from '@/hooks/api/useAgencyApi';
import usePimsApi from '@/hooks/usePimsApi';
import { dateColumnType } from '../table/CustomColumns';
import { SnackBarContext } from '@/contexts/snackbarContext';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';
import { LookupContext } from '@/contexts/lookupContext';

interface IAgencyTable {
  rowClickHandler: GridEventListener<'rowClick'>;
}

const AgencyTable = (props: IAgencyTable) => {
  const { rowClickHandler } = props;
  const { navigateAndSetFrom } = useHistoryAwareNavigate();
  const snackbar = useContext(SnackBarContext);
  const lookup = useContext(LookupContext);
  const [totalCount, setTotalCount] = useState(0);

  const handleDataChange = async (filter: any, signal: AbortSignal): Promise<any[]> => {
    try {
      const { data, totalCount } = await api.agencies.getAgencies(filter, signal);
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

  const agenciesForLookup = useMemo(() => {
    if (lookup.data) {
      return lookup.data.Agencies.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'Code',
      headerName: 'Short Name',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'IsDisabled',
      headerName: 'Is Disabled',
      flex: 1,
      type: 'boolean',
      maxWidth: 120,
    },
    {
      field: 'ParentName',
      headerName: 'Parent Agency',
      flex: 1,
      type: 'singleSelect',
      valueOptions: agenciesForLookup,
    },
    {
      field: 'SendEmail',
      headerName: 'Notification',
      flex: 1,
      type: 'boolean',
      maxWidth: 120,
    },
    {
      field: 'Email',
      headerName: 'Send To',
      flex: 1,
      maxWidth: 250,
      renderCell: (params) =>
        params.value
          ?.split(';')
          .map((email) =>
            email ? (
              <Chip key={email} label={email} variant="outlined" sx={{ marginRight: '5px' }} />
            ) : (
              ''
            ),
          ),
    },
    {
      field: 'CreatedOn',
      ...dateColumnType,
      headerName: 'Created On',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
      maxWidth: 150,
      type: 'date',
    },
    {
      field: 'UpdatedOn',
      ...dateColumnType,
      headerName: 'Updated On',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
      maxWidth: 150,
      type: 'date',
    },
  ];

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'Enabled':
        ref.current.setFilterModel({
          items: [{ value: 'false', operator: 'is', field: 'IsDisabled' }],
        });
        break;
      case 'Disabled':
        ref.current.setFilterModel({
          items: [{ value: 'true', operator: 'is', field: 'IsDisabled' }],
        });
        break;
      default:
        ref.current.setFilterModel({ items: [] });
    }
  };

  const excelDataMap = (data: Agency[]) => {
    return data.map((agency) => {
      return {
        Name: agency.Name,
        Code: agency.Code,
        'Parent Agency': agency.Parent?.Name ?? agency.Name,
        Disabled: agency.IsDisabled,
        Notifications: agency.SendEmail,
        SendTo: agency.Email,
        Created: agency.CreatedOn,
        Updated: agency.UpdatedOn,
      };
    });
  };

  const api = usePimsApi();

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
          name="agencies"
          tableOperationMode="server"
          dataSource={handleDataChange}
          onPresetFilterChange={selectPresetFilter}
          getRowId={(row: Agency) => row.Id}
          rowCount={totalCount}
          rowCountProp={totalCount}
          defaultFilter={'All'}
          onRowClick={rowClickHandler}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
            sorting: {
              sortModel: [{ field: 'Name', sort: 'asc' }],
            },
          }}
          presetFilterSelectOptions={[
            <CustomMenuItem key={'All'} value={'All'}>
              All Agencies
            </CustomMenuItem>,
            <CustomListSubheader key={'Status'}>Disabled Status</CustomListSubheader>,
            <CustomMenuItem key={'Enabled'} value={'Enabled'}>
              Enabled
            </CustomMenuItem>,
            <CustomMenuItem key={'Disabled'} value={'Disabled'}>
              Disabled
            </CustomMenuItem>,
          ]}
          tableHeader={'Agencies Overview'}
          excelTitle={'Agencies'}
          customExcelMap={excelDataMap}
          columns={columns}
          addTooltip="Create New Agency"
          onAddButtonClick={() => navigateAndSetFrom('/admin/agencies/add')}
        />
      </Box>
    </Box>
  );
};

export default AgencyTable;
