import React, { useContext, useEffect, useState } from 'react';
import DataCard from '../display/DataCard';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Typography,
  //useTheme,
} from '@mui/material';
// import { ClassificationInline } from '@/components/property/ClassificationIcon';
// import { useClassificationStyle } from '@/components/property//PropertyTable';
import DeleteDialog from '../dialog/DeleteDialog';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Project, ProjectMetadata, TierLevel, ProjectWithTasks } from '@/hooks/api/useProjectsApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { ProjectStatus } from '@/hooks/api/useLookupApi';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import DisposalPropertiesTable from './DisposalPropertiestable';
//import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { Parcel, ParcelEvaluation } from '@/hooks/api/useParcelsApi';
// import { Building, BuildingEvaluation } from '@/hooks/api/useBuildingsApi';
// import { Agency } from '@/hooks/api/useAgencyApi';

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
  console.log('Data', data);
  const { data: projectStatus, loadOnce: loadProjStatus } = useDataLoader(
    api.lookup.getProjectStatuses,
  );
  console.log('ProjStatus', projectStatus);
  loadProjStatus();
  // const parcelId = isNaN(Number(id.)) ? null : Number(params.parcelId);
  // const buildingId = isNaN(Number(id.buildingId)) ? null : Number(params.buildingId);
  // const { data: parcel, refreshData: refreshParcel } = useDataLoader(() => {
  //   if (parcelId) {
  //     return api.parcels.getParcelById(parcelId);
  //   } else {
  //     return null;
  //   }
  // });
  // const { data: building, refreshData: refreshBuilding } = useDataLoader(() => {
  //   if (buildingId) {
  //     return api.buildings.getBuildingById(buildingId);
  //   } else {
  //     return null;
  //   }
  // });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);
  //const [openDisposalPropDialog, setOpenDisposalPropDialog] = useState(false);
  const [openFinancialInfoDialog, setOpenFinancialInfoDialog] = useState(false);
  const [openDocumentationDialog, setOpenDocumentationDialog] = useState(false);

  const ProjectInfoData = {
    Classification: data?.Status,
    Id: data?.ProjectNumber,
    Name: data?.Name,
    AssignTier: data?.TierLevel,
    Notes: data?.Description,
  };

  // const columns: GridColDef[] = [
  //   {
  //     field: 'Type',
  //     headerName: 'Type',
  //     flex: 1,
  //     maxWidth: 75,
  //   },
  //   {
  //     field: 'PID_Address',
  //     headerName: 'PID/Address',
  //     flex: 1,
  //     renderCell: (params) => {
  //       return (
  //         <Link
  //           to={`/properties/${params.row.Type.toLowerCase()}/${params.row.Id}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           style={{ color: theme.palette.primary.main }}
  //         >
  //           {params.row.Type === 'Building' && params.row.Address1
  //             ? params.row.Address1
  //             : params.row.PID}
  //         </Link>
  //       ) as ReactNode;
  //     },
  //   },
  //   {
  //     field: 'Agency',
  //     headerName: 'Agency',
  //     valueGetter: (value: Agency) => value?.Name ?? 'N/A',
  //     flex: 1,
  //   },
  //   {
  //     field: 'EvaluationYears',
  //     headerName: 'Year',
  //     flex: 1,
  //     maxWidth: 75,
  //     valueGetter: (evaluationYears: number[]) => {
  //       return evaluationYears?.sort((a, b) => b - a)?.[0] ?? 'N/A'; //Sort in reverse order to obtain most recent year.
  //     },
  //   },
  //   {
  //     field: 'Evaluations',
  //     headerName: 'Assessed',
  //     maxWidth: 120,
  //     valueGetter: (evaluations: ParcelEvaluation[] | BuildingEvaluation[]) => {
  //       return evaluations?.sort((a, b) => b.Year - a.Year)[0]?.Value ?? 'N/A';
  //     },
  //     flex: 1,
  //   },
  // ];

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
  const projectFormMethods = useForm({
    defaultValues: {
      Classification: undefined,
      Id: '',
      Name: '',
      AssignTier: undefined,
      Notes: '',
    },
  });

  const financialFormMethods = useForm({
    defaultValues: {
      AssessedValue: 0,
      NetBookValue: 0,
      EstimatedMarketValue: 0,
      AppraisedValue: 0,
      EstimatedSalesCost: 0,
      EstimatedProgramRecoveryFees: 0,
    },
  });

  const documentationFormMethods = useForm({
    defaultValues: {
      SurplusDeclaration: false,
      TripleBottom: false,
      Approval: false,
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
    financialFormMethods.reset({
      AssessedValue: FinancialInformationData.AssessedValue,
      NetBookValue: FinancialInformationData.NetBookValue,
      EstimatedMarketValue: FinancialInformationData.EstimatedMarketValue,
      AppraisedValue: FinancialInformationData.AppraisedValue,
      EstimatedSalesCost: FinancialInformationData.EstimatedSalesCost,
      EstimatedProgramRecoveryFees: FinancialInformationData.EstimatedProgramRecoveryFees,
    });
    documentationFormMethods.reset({
      SurplusDeclaration: DocumentationOrApprovalData.SurplusDeclaration,
      TripleBottom: DocumentationOrApprovalData.TripleBottom,
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
      <DataCard
        id={`$Disposal Properties`}
        values={undefined}
        title={'Disposal Properties'}
        onEdit={() => {}}
        /*onEdit={() => setOpenDisposalPropDialog(true)}*/
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
      >
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
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update Financial Information'}
        open={openFinancialInfoDialog}
        onConfirm={async () => {
          const isValid = await financialFormMethods.trigger();
          if (isValid) {
            const {
              AssessedValue,
              NetBookValue,
              EstimatedMarketValue,
              AppraisedValue,
              EstimatedSalesCost,
              EstimatedProgramRecoveryFees,
            } = financialFormMethods.getValues();
            api.projects
              .updateProject(+id, {
                Assessed: AssessedValue,
                NetBook: NetBookValue,
                Market: EstimatedMarketValue,
                Appraised: AppraisedValue,
                Metadata: {
                  salesCost: EstimatedSalesCost,
                  programCost: EstimatedProgramRecoveryFees,
                },
              })
              .then(() => refreshData());
            setOpenFinancialInfoDialog(false);
          }
        }}
        onCancel={async () => setOpenFinancialInfoDialog(false)}
      >
        <FormProvider {...financialFormMethods}>
          <Grid mt={'1rem'} spacing={2} container></Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              numeric
              name={'Assessed'}
              label={'Assessed value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              numeric
              name={'NetBook'}
              label={'Net book value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Estimated'}
              label={'Estimated market value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Appraised'}
              label={'Appraised value'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Metadata.salesCost'}
              label={'Estimated sales cost'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Metadata.programCost'}
              label={'Estimated program recovery fees'}
            />
          </Grid>
        </FormProvider>
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update Documentation'}
        open={openDocumentationDialog}
        onConfirm={async () => {
          const isValid = await documentationFormMethods.trigger();
          if (isValid) {
            const { SurplusDeclaration, TripleBottom } = documentationFormMethods.getValues();
            api.projects
              .updateProject(+id, {
                // Tasks: {
                //   surplusDeclarationReadiness: SurplusDeclaration,
                //   tripleBottomLine: TripleBottom,
                // },
              })
              .then(() => refreshData());
            setOpenDocumentationDialog(false);
          }
        }}
        onCancel={async () => setOpenDocumentationDialog(false)}
      >
        <FormProvider {...documentationFormMethods}>
          <Typography variant="h5">Documentation</Typography>
          <Grid mt={'1rem'} spacing={2} container></Grid>
          {/* <Grid container spacing={2}></Grid> */}
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Task.surplusDeclarationReadiness'}
              label={'Surplus declaration & readiness checklist document emailed to SRES.'}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Task.tripleBottomLine'}
              label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
              required
            />
          </Grid>
          <Typography variant="h5">Approval</Typography>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Approval'}
              label={
                'My ministry/agency has approval/authority to submit the disposal project to SRES for review.'
              }
              required
            />
          </Grid>
        </FormProvider>
      </ConfirmDialog>
    </Box>
  );
};

export default ProjectDetail;
