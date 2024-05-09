import React, { useContext, useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography, Skeleton } from '@mui/material';
import DeleteDialog from '../dialog/DeleteDialog';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Project, ProjectMetadata, TierLevel } from '@/hooks/api/useProjectsApi';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { ProjectStatus } from '@/hooks/api/useLookupApi';
import DisposalPropertiesTable from './DisposalPropertiesSimpleTable';
import {
  ProjectAgencyResponseDialog,
  ProjectDocumentationDialog,
  ProjectFinancialDialog,
  ProjectGeneralInfoDialog,
  ProjectPropertiesDialog,
} from './ProjectDialog';
import { AgencySimpleTable } from './AgencyResponseSearchTable';

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
  const api = usePimsApi();
  // const theme = useTheme();
  const userContext = useContext(AuthContext);
  if (!userContext.keycloak.hasRoles([Roles.ADMIN, Roles.AUDITOR], { requireAllRoles: false })) {
    navigate('/');
  }
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.projects.getProjectById(Number(id)),
  );

  const { data: tasks, loadOnce: loadTasks } = useDataLoader(() => api.lookup.getTasks());
  loadTasks();

  const { data: statuses, loadOnce: loadStatuses } = useDataLoader(() =>
    api.lookup.getProjectStatuses(),
  );
  loadStatuses();

  const collectedTasksByStatus = useMemo((): Record<string, Array<any>> => {
    if (!data || !tasks || !statuses) {
      return {};
    }
    //Somewhat evil reduce where we collect information from the status and tasks lookup so that we can
    //get data for the status and task names to be displayed when we enumarete the tasks associated to the project itself
    //in the documentation history section.
    return data?.Tasks.reduce((acc: Record<string, Array<any>>, curr) => {
      const fullTask = tasks.find((a) => a.Id === curr.TaskId);
      const fullStatus = statuses.find((a) => a.Id === fullTask.StatusId);
      if (!acc[fullStatus.Name]) {
        acc[fullStatus.Name] = [{ ...curr, Name: fullTask.Name }];
        return acc;
      } else {
        acc[fullStatus.Name].push({ ...curr, Name: fullTask.Name });
        return acc;
      }
    }, {});
  }, [data, tasks, statuses]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);
  const [openDisposalPropDialog, setOpenDisposalPropDialog] = useState(false);
  const [openFinancialInfoDialog, setOpenFinancialInfoDialog] = useState(false);
  const [openDocumentationDialog, setOpenDocumentationDialog] = useState(false);
  const [openAgencyInterestDialog, setOpenAgencyInterestDialog] = useState(false);

  const ProjectInfoData = {
    Classification: data?.Status,
    ProjectNumber: data?.ProjectNumber,
    Name: data?.Name,
    AssignTier: data?.TierLevel,
    Notes: data?.Description,
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const FinancialInformationData = {
    AssessedValue: data?.Assessed,
    NetBookValue: data?.NetBook,
    EstimatedMarketValue: data?.Market,
    AppraisedValue: data?.Appraised,
    EstimatedSalesCost: currencyFormatter.format(data?.Metadata?.salesCost),
    EstimatedProgramRecoveryFees: currencyFormatter.format(data?.Metadata?.programCost),
  };

  const customFormatter = (key: keyof ProjectInfo, val: any) => {
    switch (key) {
      case 'Classification':
        return <Typography>{(val as ProjectStatus)?.Name}</Typography>;
      case 'AssignTier':
        return <Typography>{(val as TierLevel)?.Name}</Typography>;
      default:
        return <Typography>{val}</Typography>;
    }
  };

  useEffect(() => {
    refreshData();
  }, [id]);

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      flexDirection={'column'}
      width={'46rem'}
      marginX={'auto'}
    >
      <DetailViewNavigation
        navigateBackTitle={'Back to disposal Overview'}
        deleteTitle={'Delete project'}
        onDeleteClick={() => setOpenDeleteDialog(true)}
        onBackClick={() => props.onClose()}
      />
      <DataCard
        loading={isLoading}
        customFormatter={customFormatter}
        values={ProjectInfoData}
        title={'Project Information'}
        onEdit={() => setOpenProjectInfoDialog(true)}
      />
      <DataCard
        id={`$Disposal Properties`}
        values={undefined}
        title={'Disposal Properties'}
        onEdit={() => setOpenDisposalPropDialog(true)}
      >
        {isLoading ? (
          <Skeleton variant="rectangular" height={'150px'} />
        ) : (
          <DisposalPropertiesTable
            rows={[
              ...(data?.Parcels?.map((p) => ({ ...p, PropertyType: 'Parcel' })) ?? []),
              ...(data?.Buildings?.map((b) => ({ ...b, PropertyType: 'Building' })) ?? []),
            ]}
          />
        )}
      </DataCard>
      <DataCard
        loading={isLoading}
        customFormatter={customFormatter}
        values={FinancialInformationData}
        title={'Financial Information'}
        onEdit={() => setOpenFinancialInfoDialog(true)}
      />
      <DataCard
        title={'Agency Interest'}
        values={undefined}
        onEdit={() => setOpenAgencyInterestDialog(true)}
      >
        {!data ? ( //TODO: Logic will depend on precense of agency responses
          <Box display={'flex'} justifyContent={'center'}>
            <Typography>No agencies registered.</Typography>
          </Box>
        ) : (
          <AgencySimpleTable
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
            rows={[]}
          />
        )}
      </DataCard>
      <DataCard
        customFormatter={customFormatter}
        values={undefined}
        disableEdit={true}
        title={'Documentation History'}
        onEdit={() => setOpenDocumentationDialog(true)}
      >
        {Object.entries(collectedTasksByStatus)?.map(
          (
            [key, value], //Each key here is a status name. Each value a list of tasks.
          ) => (
            <Box key={`${key}-group`}>
              <Typography variant="h5" mt={'1rem'}>
                {key}
              </Typography>
              {value.map((task) => (
                <FormGroup key={`${task.TaskId}-task-formgroup`}>
                  <FormControlLabel
                    control={<Checkbox checked={task.IsCompleted} />}
                    style={{ pointerEvents: 'none' }}
                    value={task.IsCompleted}
                    label={task.Name}
                    disabled={false}
                  />
                </FormGroup>
              ))}
            </Box>
          ),
        )}
      </DataCard>
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete property'}
        message={'Are you sure you want to delete this project?'}
        onDelete={async () => {}} //Purposefully omitted for now.
        onClose={async () => setOpenDeleteDialog(false)}
      />
      <ProjectGeneralInfoDialog
        initialValues={data}
        open={openProjectInfoDialog}
        postSubmit={() => {
          setOpenProjectInfoDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenProjectInfoDialog(false)}
      />
      <ProjectFinancialDialog
        initialValues={data}
        open={openFinancialInfoDialog}
        postSubmit={() => {
          setOpenFinancialInfoDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenFinancialInfoDialog(false)}
      />
      <ProjectDocumentationDialog
        initialValues={data}
        open={openDocumentationDialog}
        postSubmit={() => {
          setOpenDocumentationDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenDocumentationDialog(false)}
      />
      <ProjectPropertiesDialog
        initialValues={data}
        open={openDisposalPropDialog}
        postSubmit={() => {
          setOpenDisposalPropDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenDisposalPropDialog(false)}
      />
      <ProjectAgencyResponseDialog
        initialValues={undefined}
        open={openAgencyInterestDialog}
        postSubmit={() => {
          setOpenAgencyInterestDialog(false);
        }}
        onCancel={() => {
          setOpenAgencyInterestDialog(false);
        }}
      />
    </Box>
  );
};

export default ProjectDetail;
