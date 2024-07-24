import React, { useContext, useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import DeleteDialog from '../dialog/DeleteDialog';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import {
  Project,
  ProjectMetadata,
  ProjectMonetary,
  ProjectNote,
  ProjectTask,
  ProjectTimestamp,
  TierLevel,
} from '@/hooks/api/useProjectsApi';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectStatus } from '@/hooks/api/useLookupApi';
import DisposalPropertiesTable from './DisposalPropertiesSimpleTable';
import ProjectNotificationsTable from './ProjectNotificationsTable';
import {
  ProjectAgencyResponseDialog,
  ProjectDocumentationDialog,
  ProjectFinancialDialog,
  ProjectGeneralInfoDialog,
  ProjectPropertiesDialog,
  ProjectNotificationDialog,
} from './ProjectDialog';
import { AgencySimpleTable } from './AgencyResponseSearchTable';
import CollapsibleSidebar from '../layout/CollapsibleSidebar';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';
import { enumReverseLookup } from '@/utilities/helperFunctions';
import { AgencyResponseType } from '@/constants/agencyResponseTypes';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { Roles } from '@/constants/roles';
import { AuthContext } from '@/contexts/authContext';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { columnNameFormatter, dateFormatter, formatMoney } from '@/utilities/formatters';
import { LookupContext } from '@/contexts/lookupContext';
import { Agency } from '@/hooks/api/useAgencyApi';
import { getStatusString } from '@/constants/chesNotificationStatus';

interface IProjectDetail {
  onClose: () => void;
}
interface ProjectInfo extends Project {
  Classification: ProjectStatus;
  AssignTier: TierLevel;
  AssessedValue: number;
  NetBookValue: number;
  EstimatedMarketValue: number;
  AppraisedValue: number;
  EstimatedSalesCost: ProjectMetadata;
  EstimatedProgramRecoveryFees: ProjectMetadata;
  SurplusDeclaration: boolean;
  TripleBottom: boolean;
}
const ProjectDetail = (props: IProjectDetail) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { keycloak } = useContext(AuthContext);
  const lookup = useContext(LookupContext);
  const api = usePimsApi();
  const { data: lookupData, getLookupValueById } = useContext(LookupContext);
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.projects.getProjectById(Number(id)),
  );

  useEffect(() => {
    if (data && data.retStatus == 403) {
      // TODO: display message with permission error
      navigate('/'); // look into maybe using redirect
    }
  }, [data]);

  const isAuditor = keycloak.hasRoles([Roles.AUDITOR]);

  const { submit: deleteProject, submitting: deletingProject } = useDataSubmitter(
    api.projects.deleteProjectById,
  );

  const { ungroupedAgencies, agencyOptions } = useGroupedAgenciesApi();
  interface IStatusHistoryStruct {
    Notes: Array<ProjectNote & { Name: string }>;
    Tasks: Array<ProjectTask & { Name: string }>;
    Timestamps: Array<ProjectTimestamp & { Name: string }>;
    Monetaries: Array<ProjectMonetary & { Name: string }>;
  }
  const collectedDocumentationByStatus = useMemo((): Record<string, IStatusHistoryStruct> => {
    if (!data || !lookupData) {
      return {};
    }
    if (!data.parsedBody?.Tasks) return {};

    //Somewhat evil reduce where we collect information from the status and tasks lookup so that we can
    //get data for the status and task names to be displayed when we enumarete the tasks associated to the project itself
    //in the documentation history section.
    const reduceMap = data?.parsedBody.Tasks.reduce(
      (acc: Record<string, IStatusHistoryStruct>, curr) => {
        if (!curr.IsCompleted) {
          return acc; //Since this is just for display purposes, no point showing non-completed in results.
        }
        const fullTask = lookupData?.Tasks.find((a) => a.Id === curr.TaskId);
        const fullStatus = lookupData?.ProjectStatuses.find((a) => a.Id === fullTask.StatusId) ?? {
          Name: 'Uncategorized',
        };
        if (!acc[fullStatus.Name]) {
          acc[fullStatus.Name] = { Tasks: [], Notes: [], Timestamps: [], Monetaries: [] };
        }
        acc[fullStatus.Name].Tasks.push({ ...curr, Name: fullTask.Name });
        return acc;
      },
      {},
    );
    data?.parsedBody.Notes.filter((a) => a.Note).reduce(
      (acc: Record<string, IStatusHistoryStruct>, curr) => {
        const fullNote = lookupData?.NoteTypes.find((a) => a.Id === curr.NoteTypeId);
        const fullStatus = lookupData?.ProjectStatuses.find((a) => a.Id === fullNote.StatusId) ?? {
          Name: 'Uncategorized',
        };
        if (!acc[fullStatus.Name]) {
          acc[fullStatus.Name] = { Tasks: [], Notes: [], Timestamps: [], Monetaries: [] };
        }
        acc[fullStatus.Name].Notes.push({ ...curr, Name: fullNote.Description });
        return acc;
      },
      reduceMap,
    );
    data?.parsedBody?.Monetaries?.filter((a) => a.Value).reduce(
      (acc: Record<string, IStatusHistoryStruct>, curr) => {
        const fullMonetary = lookupData?.MonetaryTypes.find((a) => a.Id === curr.MonetaryTypeId);
        const fullStatus = lookupData?.ProjectStatuses.find(
          (a) => a.Id === fullMonetary.StatusId,
        ) ?? {
          Name: 'Uncategorized',
        };
        if (!acc[fullStatus.Name]) {
          acc[fullStatus.Name] = { Tasks: [], Notes: [], Timestamps: [], Monetaries: [] };
        }
        acc[fullStatus.Name].Monetaries.push({ ...curr, Name: fullMonetary.Name });
        return acc;
      },
      reduceMap,
    );
    data?.parsedBody?.Timestamps?.filter((a) => a.Date).reduce(
      (acc: Record<string, IStatusHistoryStruct>, curr) => {
        const fullTimestamp = lookupData?.TimestampTypes.find((a) => a.Id === curr.TimestampTypeId);
        const fullStatus = lookupData?.ProjectStatuses.find(
          (a) => a.Id === fullTimestamp.StatusId,
        ) ?? {
          Name: 'Uncategorized',
        };
        if (!acc[fullStatus.Name]) {
          acc[fullStatus.Name] = { Tasks: [], Notes: [], Timestamps: [], Monetaries: [] };
        }
        acc[fullStatus.Name].Timestamps.push({ ...curr, Name: fullTimestamp.Name });
        return acc;
      },
      reduceMap,
    );
    return reduceMap;
  }, [data, lookupData]);

  const [notifications, setNotifications] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);
  const [openDisposalPropDialog, setOpenDisposalPropDialog] = useState(false);
  const [openFinancialInfoDialog, setOpenFinancialInfoDialog] = useState(false);
  const [openDocumentationDialog, setOpenDocumentationDialog] = useState(false);
  const [openAgencyInterestDialog, setOpenAgencyInterestDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);

  const ProjectInfoData = {
    Status: getLookupValueById('ProjectStatuses', data?.parsedBody.StatusId),
    ProjectNumber: data?.parsedBody.ProjectNumber,
    Name: data?.parsedBody.Name,
    AssignTier: getLookupValueById('ProjectTiers', data?.parsedBody.TierLevelId),
    Description: data?.parsedBody.Description,
  };

  const FinancialInformationData = useMemo(() => {
    const salesCostType = lookupData?.MonetaryTypes?.find((a) => a.Name === 'SalesCost');
    const programCostType = lookupData?.MonetaryTypes?.find((a) => a.Name === 'ProgramCost');
    return {
      AssessedValue: data?.parsedBody.Assessed,
      NetBookValue: data?.parsedBody.NetBook,
      EstimatedMarketValue: data?.parsedBody.Market,
      AppraisedValue: data?.parsedBody.Appraised,
      EstimatedSalesCost: data?.parsedBody.Monetaries?.find(
        (a) => a.MonetaryTypeId === salesCostType.Id,
      )?.Value,
      EstimatedProgramRecoveryFees: data?.parsedBody.Monetaries?.find(
        (a) => a.MonetaryTypeId === programCostType.Id,
      )?.Value,
    };
  }, [data, lookupData]);

  const customFormatter = (key: keyof ProjectInfo, val: any) => {
    switch (key) {
      case 'Status':
        return <Typography>{(val as ProjectStatus)?.Name}</Typography>;
      case 'AssignTier':
        return <Typography>{(val as TierLevel)?.Name}</Typography>;
      default:
        return <Typography>{val}</Typography>;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (id) {
        const notifications = await api.notifications.getNotificationsByProjectId(Number(id));
        setNotifications(notifications.items);
      }
    };
    fetchNotifications();
    refreshData();
  }, [id]);

  const projectInformation = 'Project Information';
  const disposalProperties = 'Disposal Properties';
  const financialInformation = 'Financial Information';
  const agencyInterest = 'Agency Interest';
  const documentationHistory = 'Documentation History';
  const notificationsHeader = 'Notifications';

  return (
    <CollapsibleSidebar
      items={[
        { title: projectInformation },
        { title: disposalProperties },
        { title: financialInformation },
        { title: agencyInterest },
        { title: documentationHistory },
        { title: notificationsHeader },
      ]}
    >
      <Box
        display={'flex'}
        gap={'1rem'}
        mt={'2rem'}
        mb={'2rem'}
        flexDirection={'column'}
        width={'46rem'}
        marginX={'auto'}
      >
        <DetailViewNavigation
          navigateBackTitle={'Back to Disposal Project Overview'}
          deleteTitle={'Delete project'}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onBackClick={() => props.onClose()}
          disableDelete={isAuditor}
        />
        <DataCard
          loading={isLoading}
          customFormatter={customFormatter}
          values={ProjectInfoData}
          id={projectInformation}
          title={projectInformation}
          onEdit={() => setOpenProjectInfoDialog(true)}
          disableEdit={isAuditor}
        />
        <DataCard
          values={undefined}
          id={disposalProperties}
          title={disposalProperties}
          onEdit={() => setOpenDisposalPropDialog(true)}
          disableEdit={isAuditor}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" height={'150px'} />
          ) : (
            <DisposalPropertiesTable
              rows={[
                ...(data?.parsedBody?.Parcels?.map((p) => ({ ...p, PropertyType: 'Parcel' })) ??
                  []),
                ...(data?.parsedBody?.Buildings?.map((b) => ({ ...b, PropertyType: 'Building' })) ??
                  []),
              ]}
            />
          )}
        </DataCard>
        <DataCard
          loading={isLoading}
          customFormatter={customFormatter}
          values={Object.fromEntries(
            Object.entries(FinancialInformationData).map(([k, v]) => [
              k,
              formatMoney(v != null ? v : 0), //This cast spaghetti sucks but hard to avoid when receiving money as a string from the API.
            ]),
          )}
          title={financialInformation}
          id={financialInformation}
          onEdit={() => setOpenFinancialInfoDialog(true)}
          disableEdit={isAuditor}
        />
        <DataCard
          loading={isLoading}
          title={agencyInterest}
          values={undefined}
          id={agencyInterest}
          onEdit={() => setOpenAgencyInterestDialog(true)}
          disableEdit={isAuditor}
        >
          {!data?.parsedBody.AgencyResponses?.length ? ( //TODO: Logic will depend on precense of agency responses
            <Box display={'flex'} justifyContent={'center'}>
              <Typography>No agencies registered.</Typography>
            </Box>
          ) : (
            <AgencySimpleTable
              editMode={false}
              sx={{
                borderStyle: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: 'none',
                },
                '& div div div div >.MuiDataGrid-cell': {
                  borderBottom: 'none',
                  borderTop: '1px solid rgba(224, 224, 224, 1)',
                },
              }}
              rows={
                data?.parsedBody.AgencyResponses && ungroupedAgencies
                  ? (data?.parsedBody.AgencyResponses?.map((resp) => ({
                      ...ungroupedAgencies?.find((agc) => agc.Id === resp.AgencyId),
                      ReceivedOn: resp.ReceivedOn,
                      Note: resp.Note,
                      Response: enumReverseLookup(AgencyResponseType, resp.Response),
                    })) as (Agency & { ReceivedOn: Date; Note: string })[])
                  : []
              }
            />
          )}
        </DataCard>
        <DataCard
          customFormatter={customFormatter}
          values={undefined}
          disableEdit={true}
          title={documentationHistory}
          id={documentationHistory}
          onEdit={() => setOpenDocumentationDialog(true)}
        >
          <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
            {Object.entries(collectedDocumentationByStatus)?.map(
              (
                [key, value], //Each key here is a status name. Each value contains an array for each field type.
              ) => (
                <Box key={`${key}-group`}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                      <Typography>{key}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
                        {value.Tasks.map((task) => (
                          <FormGroup key={`${task.TaskId}-task-formgroup`}>
                            <FormControlLabel
                              sx={{
                                '& .MuiButtonBase-root': {
                                  padding: 0,
                                  paddingX: '9px',
                                },
                              }}
                              control={
                                <Checkbox
                                  checked={task.IsCompleted}
                                  sx={{
                                    '&.MuiCheckbox-root': {
                                      color: 'rgba(0, 0, 0, 0.26)',
                                    },
                                  }}
                                />
                              }
                              style={{ pointerEvents: 'none' }}
                              value={task.IsCompleted}
                              label={task.Name}
                            />
                          </FormGroup>
                        ))}
                        {value.Notes.map((note) => (
                          <Box key={`${note.NoteTypeId}-note`}>
                            <Typography variant="h5">{note.Name}</Typography>
                            <Typography>{note.Note}</Typography>
                          </Box>
                        ))}
                        {value.Timestamps.map((ts) => (
                          <Box key={`${ts.TimestampTypeId}-timestamp`}>
                            <Typography variant="h5">{columnNameFormatter(ts.Name)}</Typography>
                            <Typography>{dateFormatter(ts.Date)}</Typography>
                          </Box>
                        ))}
                        {value.Monetaries.map((mon) => (
                          <Box key={`${mon.MonetaryTypeId}-monetary`}>
                            <Typography variant="h5">{columnNameFormatter(mon.Name)}</Typography>
                            <Typography>{formatMoney(mon.Value)}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ),
            )}
          </Box>
        </DataCard>
        <DataCard
          loading={isLoading}
          title={notificationsHeader}
          values={undefined}
          id={notificationsHeader}
          onEdit={() => setOpenNotificationDialog(true)}
          disableEdit={isAuditor || !data?.parsedBody?.Notifications?.length}
          editButtonText="View Updated Notifications"
        >
          {!data?.parsedBody.Notifications?.length ? ( //TODO: Logic will depend on precense of agency responses
            <Box display={'flex'} justifyContent={'center'}>
              <Typography>No notifications were sent for this project.</Typography>
            </Box>
          ) : (
            <ProjectNotificationsTable
              rows={
                notifications.length
                  ? notifications.map((resp) => ({
                      agency: lookup.getLookupValueById('Agencies', resp.ToAgencyId)?.Name,
                      id: resp.Id,
                      projectNumber: data?.parsedBody.ProjectNumber,
                      status: getStatusString(resp.Status),
                      sendOn: resp.SendOn,
                      to: resp.To,
                      subject: resp.Subject,
                    }))
                  : []
              }
            />
          )}
        </DataCard>
        <DeleteDialog
          open={openDeleteDialog}
          confirmButtonProps={{ loading: deletingProject }}
          title={'Delete property'}
          message={'Are you sure you want to delete this project?'}
          onDelete={async () => deleteProject(+id).then(() => navigate('/projects'))}
          onClose={async () => setOpenDeleteDialog(false)}
        />
        <ProjectGeneralInfoDialog
          initialValues={data?.parsedBody}
          open={openProjectInfoDialog}
          postSubmit={() => {
            setOpenProjectInfoDialog(false);
            refreshData();
          }}
          onCancel={() => setOpenProjectInfoDialog(false)}
        />
        <ProjectFinancialDialog
          initialValues={data?.parsedBody}
          open={openFinancialInfoDialog}
          postSubmit={() => {
            setOpenFinancialInfoDialog(false);
            refreshData();
          }}
          onCancel={() => setOpenFinancialInfoDialog(false)}
        />
        <ProjectDocumentationDialog
          initialValues={data?.parsedBody}
          open={openDocumentationDialog}
          postSubmit={() => {
            setOpenDocumentationDialog(false);
            refreshData();
          }}
          onCancel={() => setOpenDocumentationDialog(false)}
        />
        <ProjectPropertiesDialog
          initialValues={data?.parsedBody}
          open={openDisposalPropDialog}
          postSubmit={() => {
            setOpenDisposalPropDialog(false);
            refreshData();
          }}
          onCancel={() => setOpenDisposalPropDialog(false)}
        />
        <ProjectAgencyResponseDialog
          agencies={ungroupedAgencies as Agency[]}
          options={agencyOptions}
          initialValues={data?.parsedBody}
          open={openAgencyInterestDialog}
          postSubmit={() => {
            setOpenAgencyInterestDialog(false);
            refreshData();
          }}
          onCancel={() => {
            setOpenAgencyInterestDialog(false);
          }}
        />
        <ProjectNotificationDialog
          ungroupedAgencies={ungroupedAgencies as Agency[]}
          initialValues={data?.parsedBody}
          open={openNotificationDialog}
          postSubmit={() => {
            setOpenNotificationDialog(false);
            refreshData();
          }}
          onCancel={() => {
            setOpenNotificationDialog(false);
          }}
        />
      </Box>
    </CollapsibleSidebar>
  );
};

export default ProjectDetail;
