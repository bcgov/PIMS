import React, { MutableRefObject } from 'react';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import { Box, Chip, SxProps } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import {
  GridColDef,
  GridEventListener,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { dateFormatter, statusChipFormatter } from '@/utilities/formatters';
import { Agency } from '@/hooks/api/useAgencyApi';
import { useNavigate } from 'react-router-dom';
import usePimsApi from '@/hooks/usePimsApi';

interface IAgencyTable {
  rowClickHandler: GridEventListener<'rowClick'>;
}

const AgencyTable = (props: IAgencyTable) => {
  const { rowClickHandler } = props;
  const navigate = useNavigate();

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
      valueGetter: (value?: Agency) => {
        if (value) return value.Name;
        return '';
      },
    },
    {
      field: 'SendEmail',
      headerName: 'Notification',
      flex: 1,
      valueGetter: (value: boolean) => (value ? 'Yes' : 'No'),
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
      headerName: 'Created On',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
      maxWidth: 150,
      type: 'date',
    },
    {
      field: 'UpdatedOn',
      headerName: 'Updated On',
      flex: 1,
      valueFormatter: (value) => dateFormatter(value),
      maxWidth: 150,
      type: 'date',
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

  const getExcelData: (
    ref: MutableRefObject<GridApiCommunity>,
  ) => Promise<{ id: GridRowId; model: GridValidRowModel }[]> = async (
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    if (ref?.current) {
      const rows = gridFilteredSortedRowEntriesSelector(ref);
      return rows.map((row) => {
        const { id, model } = row;
        const agencyModel = model as Agency;
        return {
          id,
          model: {
            Name: agencyModel.Name,
            Ministry: agencyModel.Parent?.Name ?? agencyModel.Name,
            Code: agencyModel.Code,
            Created: agencyModel.CreatedOn,
            Disabled: agencyModel.IsDisabled,
          },
        };
      });
    }
    return [];
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
          dataSource={api.agencies.getAgencies}
          onPresetFilterChange={selectPresetFilter}
          getRowId={(row: Agency) => row.Id}
          defaultFilter={'All Agencies'}
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
          tableHeader={'Agencies Overview'}
          excelTitle={'Agencies'}
          customExcelData={getExcelData}
          columns={columns}
          addTooltip="Create New Agency"
          onAddButtonClick={() => navigate('/admin/agencies/add')}
        />
      </Box>
    </Box>
  );
};

export default AgencyTable;
