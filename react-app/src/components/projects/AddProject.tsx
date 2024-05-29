import { Box, Grid, InputAdornment, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
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
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';

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
      Tasks: [],
    },
  });

  const [showNoPropertiesError, setShowNoPropertiesError] = useState(false);
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const api = usePimsApi();
  const { data: tierData, loadOnce: loadTiers } = useDataLoader(api.lookup.getTierLevels);
  loadTiers();
  const { data: statuses, loadOnce: loadStatuses } = useDataLoader(api.lookup.getProjectStatuses);
  loadStatuses();
  const { data: tasks, loadOnce: loadTasks } = useDataLoader(api.lookup.getTasks);
  loadTasks();
  const { submit, submitting } = useDataSubmitter(api.projects.postProject);

  const tasksForAddState = useMemo(() => {
    if (!statuses || !tasks) {
      return [];
    } else {
      const defaultState = statuses.find((a) => a.Name === 'Required Documentation');
      const addTasks = tasks.filter((task) => task.StatusId === defaultState.Id);
      addTasks.forEach((task, i) => formMethods.setValue(`Tasks.${i}.TaskId`, task.Id));
      return addTasks;
    }
  }, [statuses, tasks]);

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
          onBackClick={() => navigate('/projects')}
        />
      </Box>
      <Typography variant={'h2'} mb={'2rem'}>
        Create Disposal Project
      </Typography>
      <FormProvider {...formMethods}>
        <Typography variant="h5">Project Information</Typography>
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
        <Typography variant="h5">Disposal Project Properties</Typography>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
        {showNoPropertiesError && (
          <Typography textAlign={'center'} color={theme.palette.error.main}>
            You must include at least one property.
          </Typography>
        )}
        <Typography variant="h5">Financial Information</Typography>
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
          {tasksForAddState.map((task, idx) => (
            <Grid key={`${task.Id}-task-grid`} item xs={12}>
              <SingleSelectBoxFormField
                name={`Tasks.${idx}.IsCompleted`}
                label={task.Name}
                required
              />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5">ERP Exemption</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.exemptionRequested'}
              label={'Apply for Enhanced Referral Process exemption'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Approval</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Approval'}
              label={
                'My Ministry/agency has approval/authority to submit the disposal project to SRES for review.'
              }
              required
            />
          </Grid>
        </Grid>
      </FormProvider>
      <LoadingButton
        loading={submitting}
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
            submit(
              {
                ...formValues,
                ReportedFiscalYear: new Date().getFullYear(),
                ActualFiscalYear: new Date().getFullYear(),
              },
              projectProperties,
            ).then((response) => {
              if (response && response.ok) navigate('/projects');
            });
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default AddProject;
