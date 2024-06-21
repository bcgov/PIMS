import { Grid, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import AutocompleteFormField from '../form/AutocompleteFormField';
import TextFormField from '../form/TextFormField';
import { ISelectMenuItem } from '../form/SelectFormField';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';

interface IProjectGeneralInfoForm {
  projectStatuses: ISelectMenuItem[];
}

export const ProjectGeneralInfoForm = (props: IProjectGeneralInfoForm) => {
  const api = usePimsApi();
  const { data: tiers, loadOnce } = useDataLoader(api.lookup.getTierLevels);
  loadOnce();
  return (
    <Grid mt={'1rem'} spacing={2} container>
      <Grid item xs={6}>
        <AutocompleteFormField
          required
          options={props.projectStatuses}
          name={'StatusId'}
          label={'Status'}
        />
      </Grid>
      <Grid item xs={12}>
        <TextFormField
          disabled
          required
          fullWidth
          name={'ProjectNumber'}
          label={'Project Number'}
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField required fullWidth name={'Name'} label={'Name'} />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteFormField
          name={'TierLevelId'}
          label={'Assign Tier'}
          required
          options={tiers?.map((t) => ({ label: t.Name, value: t.Id })) ?? []}
        />
      </Grid>
      <Grid item xs={12}>
        <TextFormField fullWidth multiline name={'Description'} label={'Description'} minRows={3} />
      </Grid>
    </Grid>
  );
};

export const ProjectFinancialInfoForm = () => {
  return (
    <Grid mt={'1rem'} spacing={2} container>
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
  );
};

export const ProjectDocumentationForm = () => {
  return (
    <>
      <Typography variant="h5">Documentation</Typography>
      <Grid mt={'1rem'} spacing={2} container>
        {/* <Grid container spacing={2}></Grid> */}
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
      </Grid>
    </>
  );
};
