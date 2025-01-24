import { Box, Grid, InputAdornment, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import { FormProvider, useForm } from 'react-hook-form';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import usePimsApi from '@/hooks/usePimsApi';
import { ProjectPropertyIds } from '@/hooks/api/useProjectsApi';
import DisposalProjectSearch, { PropertyWithType } from './DisposalPropertiesSearchTable';
import React from 'react';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';
import { LookupContext } from '@/contexts/lookupContext';
import { ProjectTask } from '@/constants/projectTasks';
import { MonetaryType } from '@/constants/monetaryTypes';
import { NoteTypes } from '@/constants/noteTypes';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';
import { getFiscalYear } from '@/utilities/helperFunctions';

const AddProject = () => {
  const { goToFromStateOrSetRoute } = useHistoryAwareNavigate();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      TierLevelId: null,
      Description: '',
      Assessed: 0,
      NetBook: 0,
      Market: 0,
      Appraised: 0,
      ProgramCost: 0,
      SalesCost: 0,
      ExemptionNote: '',
      Approval: false,
      Tasks: [],
      RiskId: null,
    },
  });

  const [showNoPropertiesError, setShowNoPropertiesError] = useState(false);
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const api = usePimsApi();
  const { data: lookupData } = useContext(LookupContext);
  const [tasksForAddState, setTasksForAddState] = useState([]);
  const { submit, submitting } = useDataSubmitter(api.projects.postProject);

  useEffect(() => {
    if (!lookupData) {
      return;
    } else {
      const defaultState = lookupData?.ProjectStatuses.find(
        (a) => a.Name === 'Required Documentation',
      );
      const addTasks = lookupData?.Tasks.filter((task) => task.StatusId === defaultState.Id);
      addTasks.push({
        Id: ProjectTask.EXEMPTION_REQUESTED,
        Name: 'Apply for Enhanced Referral Process exemption',
        IsOptional: true, //NOTE: If changing this at the data source, this will be out of sync.
      });
      addTasks.forEach((t, idx) => formMethods.setValue(`Tasks.${idx}.TaskId`, t.Id));
      setTasksForAddState(addTasks);
    }
  }, [lookupData, formMethods]);
  const watch = formMethods.watch('Tasks');
  const exemptionWasRequested =
    watch.find((a) => a.TaskId === ProjectTask.EXEMPTION_REQUESTED)?.IsCompleted === true;
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
          navigateBackTitle={'Back to Disposal Project Overview'}
          onBackClick={() => goToFromStateOrSetRoute('/projects')}
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
              options={
                lookupData?.ProjectTiers?.map((tier) => ({
                  value: tier.Id,
                  label: tier.Name,
                  tooltip: tier.Description,
                })) ?? []
              }
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
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'RiskId'}
              label={'Risk'}
              required
              options={
                lookupData?.Risks?.map((risk) => ({
                  value: risk.Id,
                  label: risk.Name,
                  tooltip: risk.Description,
                })) ?? []
              }
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
              label={'Net Book Value'}
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
              name={'Market'}
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
              name={'SalesCost'}
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
              name={'ProgramCost'}
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
                required={!task.IsOptional}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            {exemptionWasRequested && (
              <TextFormField
                fullWidth
                name={'ExemptionNote'}
                label={'Exemption rationale note'}
                required
                multiline
                minRows={2}
                rules={{
                  required: 'Rationale required when requesting exemption.',
                }}
              />
            )}
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
            rows.forEach((row: PropertyWithType) => {
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
                ReportedFiscalYear: getFiscalYear(),
                ActualFiscalYear: getFiscalYear(),
                Monetaries: [
                  { MonetaryTypeId: MonetaryType.PROGRAM_COST, Value: formValues.ProgramCost },
                  { MonetaryTypeId: MonetaryType.SALES_COST, Value: formValues.SalesCost },
                ],
                Tasks: formValues.Tasks.filter((a) => a.IsCompleted),
                Notes: exemptionWasRequested
                  ? [{ NoteTypeId: NoteTypes.EXEMPTION, Note: formValues.ExemptionNote }]
                  : undefined,
              },
              projectProperties,
            ).then((response) => {
              if (response && response.ok) goToFromStateOrSetRoute('/projects');
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
