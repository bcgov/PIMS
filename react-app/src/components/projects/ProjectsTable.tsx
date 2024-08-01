import usePimsApi from '@/hooks/usePimsApi';
import { GridColDef } from '@mui/x-data-grid';
import { CustomListSubheader, CustomMenuItem, FilterSearchDataGrid } from '../table/DataTable';
import React, { MutableRefObject, useContext, useState } from 'react';
import { dateFormatter, projectStatusChipFormatter } from '@/utilities/formatters';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/hooks/api/useProjectsApi';
import { NoteTypes } from '@/constants/noteTypes';
import { SnackBarContext } from '@/contexts/snackbarContext';
import { Box } from '@mui/material';
import { TimestampType } from '@/constants/timestampTypes';
import { ProjectTask } from '@/constants/projectTasks';
import { NotificationType } from '@/constants/notificationTypes';
import { MonetaryType } from '@/constants/monetaryTypes';
import { LookupContext } from '@/contexts/lookupContext';

const ProjectsTable = () => {
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const api = usePimsApi();
  const snackbar = useContext(SnackBarContext);
  const lookup = useContext(LookupContext);

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
      maxWidth: 250,
      renderCell: (params) => projectStatusChipFormatter(params.value ?? 'N/A'),
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
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
      type: 'date',
    },
    {
      field: 'UpdatedBy',
      headerName: 'Updated By',
      flex: 1,
      maxWidth: 150,
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

  const excelDataMap = (data: Project[]) => {
    return data.map((project: Project) => {
      return {
        'Project Number': project.ProjectNumber,
        Name: project.Name,
        Description: project.Description,
        'Reported Fiscal Year': project.ReportedFiscalYear,
        'Actual Fiscal Year': project.ActualFiscalYear,
        Workflow: lookup.getLookupValueById('Workflows', project.WorkflowId)?.Name,
        Status: lookup.getLookupValueById('ProjectStatuses', project.StatusId)?.Name,
        'Tier Level': lookup.getLookupValueById('ProjectTiers', project.TierLevelId)?.Name,
        Risk: lookup.getLookupValueById('Risks', project.RiskId)?.Name,
        Ministry: lookup.getLookupValueById('Agencies', project.AgencyId)?.ParentId
          ? lookup.data.Agencies.find(
              (a) => a.Id === lookup.getLookupValueById('Agencies', project.AgencyId)?.ParentId,
            )?.Name
          : lookup.getLookupValueById('Agencies', project.AgencyId)?.Name,
        Agency: lookup.getLookupValueById('Agencies', project.AgencyId)?.Name,
        'Created By': `${project.CreatedBy?.FirstName} ${project.CreatedBy?.LastName}`,
        'Created On': project.CreatedOn,
        'Exemption Requested': project.Tasks?.find(
          (task) => task.TaskId === ProjectTask.EXEMPTION_REQUESTED,
        )?.IsCompleted,
        'Exemption Rationale': project.Notes?.find(
          (note) => note.NoteTypeId === NoteTypes.EXEMPTION,
        )?.Note,
        'Current Market value': project.Market,
        'NetBook	Value': project.NetBook,
        Assessed: project.Assessed,
        Appraised: project.Appraised,
        'Sales Cost': project.Monetaries.find((m) => m.MonetaryTypeId === MonetaryType.SALES_COST)
          ?.Value,
        'Net Proceeds': project.Monetaries.find(
          (m) => m.MonetaryTypeId === MonetaryType.NET_PROCEEDS,
        )?.Value,
        'Program Cost': project.Monetaries.find(
          (m) => m.MonetaryTypeId === MonetaryType.PROGRAM_COST,
        )?.Value,
        'Gain Loss': project.Monetaries.find((m) => m.MonetaryTypeId === MonetaryType.OCG_GAIN_LOSS)
          ?.Value,
        'OCG Financial Statement': project.Monetaries.find(
          (m) => m.MonetaryTypeId === MonetaryType.OCG_FINANCIAL_STATEMENT,
        )?.Value,
        'Interest Component': project.Monetaries.find(
          (m) => m.MonetaryTypeId === MonetaryType.INTEREST_COMPONENT,
        )?.Value,
        'Offer Amount': project.Monetaries.find(
          (m) => m.MonetaryTypeId === MonetaryType.OFFER_AMOUNT,
        )?.Value,
        Note: project.Notes?.find((note) => note.NoteTypeId === NoteTypes.GENERAL)?.Note,
        PublicNote: project.Notes?.find((note) => note.NoteTypeId === NoteTypes.PUBLIC)?.Note,
        PrivateNote: project.Notes?.find((note) => note.NoteTypeId === NoteTypes.PRIVATE)?.Note,
        AppraisedNote: project.Notes?.find((note) => note.NoteTypeId === NoteTypes.APPRAISAL)?.Note,
        AgencyResponseNote: project.Notes?.find(
          (note) => note.NoteTypeId === NoteTypes.AGENCY_INTEREST,
        )?.Note,
        'Submitted On': project.SubmittedOn,
        'Approved On': project.ApprovedOn,
        'ERP Initial Notification Sent On': project.Notifications.find(
          (n) => n.TemplateId === NotificationType.NEW_PROPERTIES_ON_ERP,
        )?.SendOn,
        'ERP Thirty Day Notification Sent On': project.Notifications.find(
          (n) => n.TemplateId === NotificationType.THIRTY_DAY_ERP_NOTIFICATION_PARENT_AGENCIES,
        )?.SendOn,
        'ERP Sixty Day Notification Sent On': project.Notifications.find(
          (n) => n.TemplateId === NotificationType.SIXTY_DAY_ERP_NOTIFICATION_PARENT_AGENCIES,
        )?.SendOn,
        'ERP Ninety Day Notification Sent On': project.Notifications.find(
          (n) => n.TemplateId === NotificationType.NINTY_DAY_ERP_NOTIFICATION_PARENT_AGENCIES,
        )?.SendOn,
        'Transferred Within GRE On': project.Timestamps.find(
          (timestamp) => timestamp.TimestampTypeId === TimestampType.TRANSFERRED_WITHIN_GRE_ON,
        )?.Date,
        'ERP Clearance Notification Sent On': project.Timestamps.find(
          (timestamp) => timestamp.TimestampTypeId === TimestampType.CLEARANCE_NOTIFICATION_SENT_ON,
        )?.Date,
        'Disposed On': project.Timestamps.find(
          (timestamp) => timestamp.TimestampTypeId === TimestampType.DISPOSED_ON,
        )?.Date,
        'Marketed On': project.Timestamps.find(
          (timestamp) => timestamp.TimestampTypeId === TimestampType.MARKETED_ON,
        )?.Date,
        'Offers Note': project.Notes?.find((note) => note.NoteTypeId === NoteTypes.OFFER)?.Note,
        Purchaser: project.Notes?.find((note) => note.NoteTypeId === NoteTypes.PURCHASER)?.Note,
      };
    });
  };

  const handleDataChange = async (filter: any, signal: AbortSignal): Promise<any[]> => {
    try {
      const { data, totalCount } = await api.projects.getProjects(filter, signal);
      setTotalCount(totalCount);
      return data;
    } catch (error) {
      snackbar.setMessageState({
        open: true,
        text: 'Error loading projects.',
        style: snackbar.styles.warning,
      });
      return [];
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 180px)' }}>
      <FilterSearchDataGrid
        tableOperationMode="server"
        dataSource={handleDataChange}
        excelDataSource={api.projects.getProjectsForExcelExport}
        onAddButtonClick={() => navigate('/projects/add', { state: { from: location } })}
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
        rowCountProp={totalCount}
        rowCount={totalCount}
        getRowId={(row) => row.Id}
        onRowClick={(params) => navigate(`/projects/${params.row.Id}`)}
        tableHeader={'Disposal Projects Overview'}
        excelTitle={'Projects'}
        customExcelMap={excelDataMap}
        addTooltip={'Create New Disposal Project'}
        name={'projects'}
        columns={columns}
        // initialState={{
        //   pagination: { paginationModel: { page: 0, pageSize: 100 } },
        //   sorting: { sortModel: [{ field: 'UpdatedOn', sort: 'desc' }] },
        // }}
      />
    </Box>
  );
};

export default ProjectsTable;
