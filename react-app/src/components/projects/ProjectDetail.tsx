import React, { useContext, useEffect, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import DeleteDialog from '../dialog/DeleteDialog';
import { useForm } from 'react-hook-form';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { ProjectMetadata, TierLevel, ProjectWithTasks } from '@/hooks/api/useProjectsApi';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { ProjectStatus } from '@/hooks/api/useLookupApi';
import DisposalPropertiesTable from './DisposalPropertiesSimpleTable';
import {
  ProjectDocumentationDialog,
  ProjectFinancialDialog,
  ProjectGeneralInfoDialog,
} from './ProjectDialog';

interface IProjectDetail {
  onClose: () => void;
}
interface ProjectInfo extends ProjectWithTasks {
  Classification: ProjectStatus;
  AssignTier: TierLevel;
  Notes: string;
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
  const { data, refreshData } = useDataLoader(() => api.projects.getProjectById(Number(id)));

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);
  const [openDisposalPropDialog, setOpenDisposalPropDialog] = useState(false);
  const [openFinancialInfoDialog, setOpenFinancialInfoDialog] = useState(false);
  const [openDocumentationDialog, setOpenDocumentationDialog] = useState(false);

  const ProjectInfoData = {
    Classification: data?.Status,
    Id: data?.ProjectNumber,
    Name: data?.Name,
    AssignTier: data?.TierLevel,
    Notes: data?.Description,
  };

  const FinancialInformationData = {
    AssessedValue: data?.Assessed,
    NetBookValue: data?.NetBook,
    EstimatedMarketValue: data?.Market,
    AppraisedValue: data?.Appraised,
    EstimatedSalesCost: data?.Metadata?.salesCost,
    EstimatedProgramRecoveryFees: data?.Metadata?.programCost,
  };

  const DocumentationOrApprovalData = {
    SurplusDeclaration: true, //data?.ProjectTasks?.find((task) => task.TaskId === 1).IsCompleted,
    TripleBottom: true, //data?.ProjectTasks?.find((task) => task.TaskId === 2).IsCompleted, //TODO: Uncomment once tasks become array
  };

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
      case 'SurplusDeclaration':
        return (
          <>
            <Typography variant="h5">Documentation</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                style={{ pointerEvents: 'none' }}
                value={val ? '1' : '0'}
                label={'Surplus declaration & readiness checklist document emailed to SRES'}
                disabled={false}
              />
            </FormGroup>
          </>
        );
      case 'TripleBottom':
        return (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              style={{ pointerEvents: 'none' }}
              value={val ? '0' : '1'}
              label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
              disabled={false}
            />
          </FormGroup>
        );
      // case 'Approval':
      //   return (
      //     <FormGroup>
      //       <FormControlLabel
      //         control={<Checkbox />}
      //         style={{ pointerEvents: 'none' }}
      //         value={val ? '1' : '0'}
      //         label={
      //           'My ministry/agency has approval/authority to submit the disposal project to SRES for review.'
      //         }
      //         disabled={false}
      //       />
      //     </FormGroup>
      //   );
      default:
        return <Typography>{val}</Typography>;
    }
  };
  // const projectFormMethods = useForm({
  //   defaultValues: {
  //     Classification: undefined,
  //     Id: '',
  //     Name: '',
  //     AssignTier: undefined,
  //     Notes: '',
  //   },
  // });

  // const financialFormMethods = useForm({
  //   defaultValues: {
  //     AssessedValue: 0,
  //     NetBookValue: 0,
  //     EstimatedMarketValue: 0,
  //     AppraisedValue: 0,
  //     EstimatedSalesCost: 0,
  //     EstimatedProgramRecoveryFees: 0,
  //   },
  // });

  // const documentationFormMethods = useForm({
  //   defaultValues: {
  //     SurplusDeclaration: false,
  //     TripleBottom: false,
  //     Approval: false,
  //   },
  // });

  useEffect(() => {
    refreshData();
  }, [id]);

  // useEffect(() => {
  //   projectFormMethods.reset({
  //     Classification: ProjectInfoData.Classification,
  //     Id: ProjectInfoData.Id,
  //     Name: ProjectInfoData.Name,
  //     AssignTier: ProjectInfoData.AssignTier,
  //     Notes: ProjectInfoData.Notes,
  //   });
  //   financialFormMethods.reset({
  //     AssessedValue: FinancialInformationData.AssessedValue,
  //     NetBookValue: FinancialInformationData.NetBookValue,
  //     EstimatedMarketValue: FinancialInformationData.EstimatedMarketValue,
  //     AppraisedValue: FinancialInformationData.AppraisedValue,
  //     EstimatedSalesCost: FinancialInformationData.EstimatedSalesCost,
  //     EstimatedProgramRecoveryFees: FinancialInformationData.EstimatedProgramRecoveryFees,
  //   });
  //   documentationFormMethods.reset({
  //     SurplusDeclaration: DocumentationOrApprovalData.SurplusDeclaration,
  //     TripleBottom: DocumentationOrApprovalData.TripleBottom,
  //   });
  // }, [data]);

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
      <DataCard
        id={`$Disposal Properties`}
        values={undefined}
        title={'Disposal Properties'}
        onEdit={() => setOpenDisposalPropDialog(true)}
      >
        <DisposalPropertiesTable
          rows={[
            ...(data?.Parcels?.map((p) => ({ ...p, PropertyType: 'Parcel' })) ?? []),
            ...(data?.Buildings?.map((b) => ({ ...b, PropertyType: 'Building' })) ?? []),
          ]}
        />
      </DataCard>
      <DataCard
        customFormatter={customFormatter}
        values={FinancialInformationData}
        title={'Financial Information'}
        onEdit={() => setOpenFinancialInfoDialog(true)}
      />
      <DataCard
        customFormatter={customFormatter}
        values={DocumentationOrApprovalData}
        title={'Documentation/Approval'}
        onEdit={() => setOpenDocumentationDialog(true)}
      />
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
    </Box>
  );
};

export default ProjectDetail;
