import { Box, Button, Grid, InputAdornment, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import { FormProvider, useForm } from 'react-hook-form';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import { useNavigate } from 'react-router-dom';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { ProjectPropertyIds } from '@/hooks/api/useProjectsApi';
import DisposalProjectSearch, {
  BuildingWithType,
  ParcelWithType,
} from './DisposalPropertiesSearchTable';
import React from 'react';
import { ProjectTask } from '@/constants/projectTasks';

const AddProject = () => {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      TierLevelId: null,
      Description: '',
      Assessed: 0,
      NetBook: 0,
      Estimated: 0,
      Appraised: 0,
      Metadata: {
        salesCost: 0,
        programCost: 0,
        exemptionRequested: false,
      },
      Approval: false,
      Tasks: {
        surplusDeclarationReadiness: false,
        tripleBottomLine: false,
      },
    },
  });

  const [showNoPropertiesError, setShowNoPropertiesError] = useState(false);
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const api = usePimsApi();
  const { data: tierData, loadOnce: loadTiers } = useDataLoader(api.lookup.getTierLevels);
  loadTiers();

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      mb={'2rem'}
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
      boxShadow={'2em'}
    >
      <Box>
        <NavigateBackButton
          navigateBackTitle={'Back to Disposal Projects'}
          onBackClick={() => {}}
        />
      </Box>
      <Typography variant={'h2'} mb={'2rem'}>
        Create disposal project
      </Typography>
      <FormProvider {...formMethods}>
        <Typography variant="h5">Project information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'Name'} label={'Name'} />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              required
              name={'TierLevelId'}
              label={'Assign tier'}
              options={tierData?.map((tier) => ({ value: tier.Id, label: tier.Name })) ?? []}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField
              multiline
              minRows={3}
              fullWidth
              name={'Description'}
              label={'Description'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Disposal properties</Typography>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
        {showNoPropertiesError && (
          <Typography textAlign={'center'} color={theme.palette.error.main}>
            You must include at least one property.
          </Typography>
        )}
        <Typography variant="h5">Financial information</Typography>
        <Grid container spacing={2}>
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
        </Grid>
        <Typography variant="h5">Documentation</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Tasks.surplusDeclarationReadiness'}
              label={'Surplus declaration & readiness checklist document emailed to SRES.'}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Tasks.tripleBottomLine'}
              label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
              required
            />
          </Grid>
        </Grid>
        <Typography variant="h5">ERP Exemption</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.exemptionRequested'}
              label={'Apply for enhanced referral process exemption'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Approval</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Approval'}
              label={
                'My ministry/agency has approval/authority to submit the disposal project to SRES for review.'
              }
              required
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          setShowNoPropertiesError(!rows.length);
          if (isValid && rows.length) {
            const formValues = formMethods.getValues();
            // Construct project properties arrays
            const projectProperties: ProjectPropertyIds = {
              parcels: [],
              buildings: [],
            };
            rows.forEach((row: ParcelWithType | BuildingWithType) => {
              if (row.Type === 'Parcel') {
                projectProperties.parcels.push(row.Id);
              } else if (row.Type === 'Building') {
                projectProperties.buildings.push(row.Id);
              }
            });
            // Send to API hook
            api.projects
              .postProject(
                {
                  ...formValues,
                  ReportedFiscalYear: new Date().getFullYear(),
                  ActualFiscalYear: new Date().getFullYear(),
                  Tasks: [
                    {
                      TaskId: ProjectTask.SURPLUS_DECLARATION_READINESS,
                      IsCompleted: formValues.Tasks.surplusDeclarationReadiness,
                    },
                    {
                      TaskId: ProjectTask.TRIPLE_BOTTOM_LINE,
                      IsCompleted: formValues.Tasks.tripleBottomLine,
                    },
                  ],
                },
                projectProperties,
              )
              .then((response) => {
                if (response.status === 201) navigate('/projects');
              });
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddProject;
