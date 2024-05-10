import React, { useContext, useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography, Skeleton } from '@mui/material';
import DeleteDialog from '../dialog/DeleteDialog';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Project, ProjectMetadata, TierLevel } from '@/hooks/api/useProjectsApi';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { ProjectStatus } from '@/hooks/api/useLookupApi';
import DisposalPropertiesTable from './DisposalPropertiesSimpleTable';
import {
  ProjectDocumentationDialog,
  ProjectFinancialDialog,
  ProjectGeneralInfoDialog,
  ProjectPropertiesDialog,
} from './ProjectDialog';

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
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.projects.getProjectById(Number(id)),
  );

  const authCheck = () => {
    try{
      if (data.retStatus == 403){
        // TODO: display message with permission error 
        return false; // look into maybe using redirect
      };
    } catch (e) {
      // do nothing, we get 2 undefined statuses before the real data is sent
    };
    return true;
  };

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
    return data?.parsedBody.Tasks.reduce((acc: Record<string, Array<any>>, curr) => {
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

  const ProjectInfoData = {
    Classification: data?.parsedBody.Status,
    ProjectNumber: data?.parsedBody.ProjectNumber,
    Name: data?.parsedBody.Name,
    AssignTier: data?.parsedBody.TierLevel,
    Notes: data?.parsedBody.Description,
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const FinancialInformationData = {

    AssessedValue: data?.parsedBody.Assessed,
    NetBookValue: data?.parsedBody.NetBook,
    EstimatedMarketValue: data?.parsedBody.Market,
    AppraisedValue: data?.parsedBody.Appraised,
    EstimatedSalesCost: data?.parsedBody.Metadata?.salesCost,
    EstimatedProgramRecoveryFees: data?.parsedBody.Metadata?.programCost,
  };

  // const classification = useClassificationStyle();
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
              ...(data?.parsedBody.Parcels?.map((p) => ({ ...p, PropertyType: 'Parcel' })) ?? []),
              ...(data?.parsedBody.Buildings?.map((b) => ({ ...b, PropertyType: 'Building' })) ?? []),
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
        initialValues={data.parsedBody}
        open={openProjectInfoDialog}
        postSubmit={() => {
          setOpenProjectInfoDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenProjectInfoDialog(false)}
      />
      <ProjectFinancialDialog
        initialValues={data.parsedBody}
        open={openFinancialInfoDialog}
        postSubmit={() => {
          setOpenFinancialInfoDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenFinancialInfoDialog(false)}
      />
      <ProjectDocumentationDialog
        initialValues={data.parsedBody}
        open={openDocumentationDialog}
        postSubmit={() => {
          setOpenDocumentationDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenDocumentationDialog(false)}
      />
      <ProjectPropertiesDialog
        initialValues={data.parsedBody}
        open={openDisposalPropDialog}
        postSubmit={() => {
          setOpenDisposalPropDialog(false);
          refreshData();
        }}
        onCancel={() => setOpenDisposalPropDialog(false)}
      />
    </Box>

  );
};

export default ProjectDetail;
