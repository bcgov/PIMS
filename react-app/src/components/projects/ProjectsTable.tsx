import usePimsApi from '@/hooks/usePimsApi';
import {
  GridColDef,
  gridFilteredSortedRowEntriesSelector,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import React, { MutableRefObject, useContext } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import { dateFormatter, projectStatusChipFormatter } from '@/utilities/formatters';
import { Agency } from '@/hooks/api/useAgencyApi';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { User } from '@/hooks/api/useUsersApi';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/hooks/api/useProjectsApi';
import { NoteTypes } from '@/constants/noteTypes';
import { SnackBarContext } from '@/contexts/snackbarContext';

const ProjectsTable = () => {
  const navigate = useNavigate();
  const api = usePimsApi();
  const snackbar = useContext(SnackBarContext);
  const { data, loadOnce } = useDataLoader(api.projects.getProjects);
  loadOnce();

  const parseIntFromProjectNo = (projectNo: string) => {
    return Number(projectNo.match(/[a-zA-Z]+-?(\d+)/)[1]);
  };

  const columns: GridColDef[] = [
    {
      field: 'ProjectNumber',
      headerName: 'Project No.',
      flex: 1,
      maxWidth: 120,
      sortComparator: (a, b) => parseIntFromProjectNo(a) - parseIntFromProjectNo(b),
    },
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (value: any) => value?.Name ?? 'N/A',
      renderCell: (params) => projectStatusChipFormatter(params.value ?? 'N/A'),
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (value: Agency) => value?.Name ?? '',
    },
    {
      field: 'NetBook',
      headerName: 'Net Book Value',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'Market',
      headerName: 'Market Value',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Updated On',
      flex: 1,
      valueFormatter: (date) => dateFormatter(date),
      maxWidth: 125,
    },
    {
      field: 'UpdatedBy',
      headerName: 'Updated By',
      flex: 1,
      maxWidth: 150,
      valueGetter: (user: User) => `${user?.FirstName ?? ''} ${user?.LastName ?? ''}`,
    },
  ];

  const selectPresetFilter = (
    value: string | Record<string, any>,
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    switch (value) {
      case 'All Projects':
        ref.current.setFilterModel({ items: [] });
        break;
      case 'Approved for Exemption':
      case 'Approved for ERP':
      case 'In ERP':
        ref.current.setFilterModel({ items: [{ value, operator: 'contains', field: 'Status' }] });
    }
  };

  const getExcelData: (
    ref: MutableRefObject<GridApiCommunity>,
  ) => Promise<{ id: GridRowId; model: GridValidRowModel }[]> = async (
    ref: MutableRefObject<GridApiCommunity>,
  ) => {
    if (ref?.current) {
      try {
        const projectsWithExtras = await api.projects.getProjectsForExcelExport();
        if (!projectsWithExtras) {
          throw new Error('Projects could not be reached. Refresh and try again.');
        }
        ref.current.setRows(projectsWithExtras);
        const rows = gridFilteredSortedRowEntriesSelector(ref);
        return rows.map((row) => {
          const { id, model } = row;
          const projectModel = model as Project;
          return {
            id,
            model: {
              'Project Number': projectModel.ProjectNumber,
              Name: projectModel.Name,
              Description: projectModel.Description,
              'Reported Fiscal Year': projectModel.ReportedFiscalYear,
              'Actual Fiscal Year': projectModel.ActualFiscalYear,
              Workflow: projectModel.Workflow?.Name,
              Status: projectModel.Status?.Name,
              'Tier Level': projectModel.TierLevel?.Name,
              Risk: projectModel.Risk?.Name,
              Ministry: projectModel.Agency?.Parent?.Name ?? projectModel.Agency?.Name,
              Agency: projectModel.Agency?.Name,
              'Created By': `${projectModel.CreatedBy?.FirstName} ${projectModel.CreatedBy?.LastName}`,
              'Created On': projectModel.CreatedOn,
              'Exemption Requested': projectModel.Metadata?.exemptionRequested,
              'Exemption Rationale': projectModel.Notes?.find(
                (note) => note.NoteType === NoteTypes.EXEMPTION,
              )?.Note,
              'NetBook	Value': projectModel.NetBook,
              Assessed: projectModel.Assessed,
              Appraised: projectModel.Appraised,
              'Sales Cost': projectModel.Metadata?.salesCost,
              'Net Proceeds': projectModel.Metadata?.netProceeds,
              'Program Cost': projectModel.Metadata?.programCost,
              'Gain Loss': projectModel.Metadata?.gainLoss,
              'OCG Financial Statement': projectModel.Metadata?.ocgFinancialStatement,
              'Interest Component': projectModel.Metadata?.interestComponent,
              'Offer Amount': projectModel.Metadata?.offerAmount,
              'Sale With Lease In Place': projectModel.Metadata?.saleWithLeaseInPlace,
              Note: projectModel.Notes?.find((note) => note.NoteType === NoteTypes.GENERAL)?.Note,
              PublicNote: projectModel.Notes?.find((note) => note.NoteType === NoteTypes.PUBLIC)
                ?.Note,
              PrivateNote: projectModel.Notes?.find((note) => note.NoteType === NoteTypes.PRIVATE)
                ?.Note,
              AppraisedNote: projectModel.Notes?.find(
                (note) => note.NoteType === NoteTypes.APPRAISAL,
              )?.Note,
              AgencyResponseNote: projectModel.Notes?.find(
                (note) => note.NoteType === NoteTypes.AGENCY_INTEREST,
              )?.Note,
              'Submitted On': projectModel.SubmittedOn,
              'Approved On': projectModel.ApprovedOn,
              'ERP Initial Notification Sent On': projectModel.Metadata?.initialNotificationSentOn,
              'ERP Thirty Day Notification Sent On':
                projectModel.Metadata?.thirtyDayNotificationSentOn,
              'ERP Sixty Day Notification Sent On':
                projectModel.Metadata?.sixtyDayNotificationSentOn,
              'ERP Ninety Day Notification Sent On':
                projectModel.Metadata?.ninetyDayNotificationSentOn,
              'ERP On Hold Notification Sent On': projectModel.Metadata?.onHoldNotificationSentOn,
              'Transferred Within GRE On': projectModel.Metadata?.transferredWithinGreOn,
              'ERP Clearance Notification Sent On':
                projectModel.Metadata?.clearanceNotificationSentOn,
              'Disposed On': projectModel.Metadata?.disposedOn,
              'Marketed On': projectModel.Metadata?.marketedOn,
              'Offers Note': projectModel.Notes?.find((note) => note.NoteType === NoteTypes.OFFER)
                ?.Note,
              Purchaser: projectModel.Metadata?.purchaser,
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
    <FilterSearchDataGrid
      onAddButtonClick={() => navigate('/projects/add')}
      onPresetFilterChange={selectPresetFilter}
      defaultFilter={'All Projects'}
      presetFilterSelectOptions={[
        <CustomMenuItem key={'All Projects'} value={'All Projects'}>
          All Projects
        </CustomMenuItem>,
        <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
        <CustomMenuItem key={'In ERP'} value={'In ERP'}>
          In ERP
        </CustomMenuItem>,
        <CustomMenuItem key={'Approved for ERP'} value={'Approved for ERP'}>
          Approved for ERP
        </CustomMenuItem>,
        <CustomMenuItem key={'Approved for Exemption'} value={'Approved for Exemption'}>
          Approved for Exemption
        </CustomMenuItem>,
      ]}
      getRowId={(row) => row.Id}
      onRowClick={(params) => navigate(`/projects/${params.row.Id}`)}
      tableHeader={'Disposal Projects Overview'}
      excelTitle={'Projects'}
      customExcelData={getExcelData}
      addTooltip={'Create New Disposal Project'}
      name={'projects'}
      columns={columns}
      rows={data ?? []}
      initialState={{
        sorting: { sortModel: [{ field: 'UpdatedOn', sort: 'desc' }] },
      }}
    />
  );
};

export default ProjectsTable;
