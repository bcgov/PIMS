import React, { MutableRefObject, useEffect, useState } from 'react';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, Chip, SxProps } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridColDef, GridEventListener } from '@mui/x-data-grid';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { dateFormatter, statusChipFormatter } from '@/utilities/formatters';
import { Agency } from '@/hooks/api/useAgencyApi';
import { useNavigate } from 'react-router-dom';

interface IAgencyTable {
  rowClickHandler: GridEventListener<'rowClick'>;
  data: Record<string, any>[];
  isLoading: boolean;
  refreshData: () => void;
  error: unknown;
}

const AgencyTable = (props: IAgencyTable) => {
  const { rowClickHandler, data, isLoading, refreshData, error } = props;
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const { state } = useSSO();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (data && data.length > 0) {
      setAgencies(data as Agency[]);
    } else {
      refreshData();
    }
  }, [state, data]);

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
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        if (params.value === undefined) return <></>; // Checked for undefined specifically
        if (params.value) return statusChipFormatter('Disabled');
        return statusChipFormatter('Active');
      },
      maxWidth: 120,
    },
    {
      field: 'Parent',
      headerName: 'Parent Agency',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) return params.value.Name;
        return '';
      },
    },
    {
      field: 'SendEmail',
      headerName: 'Notification',
      flex: 1,
      valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
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
      headerName: 'Created',
      flex: 1,
      valueFormatter: (params) => dateFormatter(params.value),
      maxWidth: 150,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Last Update',
      flex: 1,
      valueFormatter: (params) => dateFormatter(params.value),
      maxWidth: 150,
    },
  ];

  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    switch (value) {
      case 'All Agencies':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Active':
        ref.current.setFilterModel({
          items: [{ value: 'false', operator: 'equals', field: 'IsDisabled' }],
        });
        break;
      case 'Disabled':
        ref.current.setFilterModel({
          items: [{ value: 'true', operator: 'equals', field: 'IsDisabled' }],
        });
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
        name="agencies"
        onPresetFilterChange={selectPresetFilter}
        getRowId={(row: Agency) => row.Id}
        defaultFilter={'All Agencies'}
        onRowClick={rowClickHandler}
        initialState={{
          sorting: {
            sortModel: [{ field: 'Name', sort: 'asc' }],
          },
        }}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'All Agencies'} value={'All Agencies'}>
            All Agencies
          </CustomMenuItem>,
          <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
          <CustomMenuItem key={'Active'} value={'Active'}>
            Active
          </CustomMenuItem>,
          <CustomMenuItem key={'Disabled'} value={'Disabled'}>
            Disabled
          </CustomMenuItem>,
        ]}
        loading={isLoading}
        tableHeader={'Agencies Overview'}
        excelTitle={'Agencies'}
        columns={columns}
        rows={agencies}
        addTooltip="Add a new agency"
        onAddButtonClick={() => navigate('/admin/agencies/add')}
      />
    </Box>
  );
};

export default AgencyTable;
