import React, { useContext, useEffect, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Grid, Typography } from '@mui/material';
import { ClassificationInline } from '@/components/property/ClassificationIcon';
import { useClassificationStyle } from '@/components/property//PropertyTable';
import DeleteDialog from '../dialog/DeleteDialog';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Project, TierLevel } from '@/hooks/api/useProjectsApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { ProjectStatus } from '@/hooks/api/useLookupApi';

interface IProjectDetail {
  onClose: () => void;
}
interface ProjectInfo extends Project {
  Classification: ProjectStatus;
  // ProjectNumber: string;
  AssignTier: TierLevel;
  Notes: string;
  // Name: string;
}
const ProjectDetail = (props: IProjectDetail) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const api = usePimsApi();
  const userContext = useContext(AuthContext);
  if (!userContext.keycloak.hasRole([Roles.ADMIN, Roles.AUDITOR], { requireAllRoles: false })) {
    navigate('/');
  }
  const { data, refreshData } = useDataLoader(() => api.projects.getProjectById(Number(id)));
  const { data: projectStatus, loadOnce: loadProjStatus } = useDataLoader(
    api.lookup.getProjectStatus,
  );
  loadProjStatus();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);
  // const [openDisposalPropDialog, setOpenDisposalPropDialog] = useState(false);
  // const [openFinancialInfoDialog, setOpenFinancialInfoDialog] = useState(false);
  // const [openDocumentationDialog, setOpenDocumentationDialog] = useState(false);

  const ProjectInfoData = {
    Classification: data?.Status,
    Id: data?.ProjectNumber,
    Name: data?.Name,
    AssignTier: data?.TierLevel,
    Notes: data?.Description,
  };

  // const DisposalPropertiesData = {
  //   //Need to be filled in
  // };

  // const FinancialInformationData = {
  //   AssessedValue: data?.Assessed,
  //   NetBookValue: data?.NetBook,
  //   EstimatedMarketValue: data?.Market,
  //   AppraisedValue: data?.Appraised,
  //   EstimatedSalesCost: data?.Metadata?.salesCost,
  //   EstimatedProgramRecoveryFees: data?.Metadata?.programCost,
  // };

  // const DocumentationOrApprovalData = {
  //   //Need to be filled in
  // };

  // const classification = useClassificationStyle();
  const customFormatter = (key: keyof ProjectInfo, val: any) => {
    switch (key) {
      // case 'Classification':
      //   return (
      //     <ClassificationInline
      //       color={classification[val.Id].textColor}
      //       backgroundColor={classification[val.Id].bgColor}
      //       title={val.Name}
      //     />
      //   );
      case 'Classification':
        return <Typography>{(val as ProjectStatus)?.Name}</Typography>;
      case 'AssignTier':
        return <Typography>{(val as TierLevel)?.Name}</Typography>;
      default:
        return <Typography>{val}</Typography>;
    }
  };
  const projectFormMethods = useForm({
    defaultValues: {
      Classification: undefined,
      Id: '',
      Name: '',
      AssignTier: undefined,
      Notes: '',
    },
  });

  useEffect(() => {
    refreshData();
  }, [id]);

  useEffect(() => {
    projectFormMethods.reset({
      Classification: ProjectInfoData.Classification,
      Id: ProjectInfoData.Id,
      Name: ProjectInfoData.Name,
      AssignTier: ProjectInfoData.AssignTier,
      Notes: ProjectInfoData.Notes,
    });
  }, [data]);

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
        customFormatter={customFormatter}
        values={ProjectInfoData}
        title={'Project Information'}
        onEdit={() => setOpenProjectInfoDialog(true)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete property'}
        message={'Are you sure you want to delete this project?'}
        onDelete={async () => {}} //Purposefully omitted for now.
        onClose={async () => setOpenDeleteDialog(false)}
      />
      <ConfirmDialog
        title={'Update Project'}
        open={openProjectInfoDialog}
        onConfirm={async () => {
          const isValid = await projectFormMethods.trigger();
          if (isValid) {
            const { Classification, Name, AssignTier, Notes } = projectFormMethods.getValues();
            api.projects
              .updateProject(+id, {
                StatusId: Classification.Id,
                Name,
                TierLevelId: AssignTier.Id,
                Description: Notes,
              })
              .then(() => refreshData());
            setOpenProjectInfoDialog(false);
          }
        }}
        onCancel={async () => setOpenProjectInfoDialog(false)}
      ></ConfirmDialog>
      <FormProvider {...projectFormMethods}>
        <Grid mt={'1rem'} spacing={2} container>
          <Grid item xs={6}>
            <AutocompleteFormField
              required
              options={
                projectStatus?.map((status) => ({ label: status.Name, value: status.Id })) ?? []
              }
              name={'ProjectStatus'}
              label={'Classification'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'ProjectNumber'} label={'Id'} />
          </Grid>
          <Grid item xs={6}>
            <TextFormField required fullWidth name={'Name'} label={'Name'} />
          </Grid>
          <Grid item xs={6}>
            <AutocompleteFormField
              name={'Tier'}
              label={'AssignTier'}
              required
              options={[
                { label: 'Tier 1', value: 'Tier 1' },
                { label: 'Tier 2', value: 'Tier 2' },
                { label: 'Tier 3', value: 'Tier 3' },
                { label: 'Tier 4', value: 'Tier 4' },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField fullWidth multiline name={'Description'} label={'Notes'} minRows={3} />
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default ProjectDetail;
