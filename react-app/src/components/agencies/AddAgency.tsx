import TextFormField from '@/components/form/TextFormField';
import { Box, Grid, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';
import EmailChipFormField from '@/components/form/EmailChipFormField';
import SingleSelectBoxFormField from '@/components/form/SingleSelectBoxFormField';
import { NavigateBackButton } from '@/components/display/DetailViewNavigation';
import { useNavigate } from 'react-router-dom';
import { AgencyAdd } from '@/hooks/api/useAgencyApi';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';

const AddAgency = () => {
  const api = usePimsApi();
  const navigate = useNavigate();
  const { submit, submitting } = useDataSubmitter(api.agencies.addAgency);
  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const formMethods = useForm({
    defaultValues: {
      Name: '',
      Description: '',
      Code: '',
      ParentId: undefined,
      SendEmail: false,
      To: [],
      CC: [],
    },
  });

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      mb={'2rem'}
      pb={'2rem'}
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
      boxShadow={'2em'}
    >
      <Box>
        <NavigateBackButton
          navigateBackTitle="Back to Agency Overview"
          onBackClick={() => navigate('/admin/agencies')}
        />
      </Box>
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add New Agency
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Agency Details</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'Name'} label={`Agency Name`} />
          </Grid>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'Code'} label={`Agency Code`} />
          </Grid>
          <Grid item xs={12}>
            <TextFormField
              fullWidth
              multiline
              minRows={3}
              name={'Description'}
              label={'Description'}
            />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'ParentId'}
              label={'Parent Agency'}
              // Only agencies that don't have a parent can be chosen.
              // Set parent to false to avoid bold font.
              options={agencyOptions
                .filter((agency) => agency.parentId == null)
                .map((agency) => ({ ...agency, parent: false }))}
              disableClearable={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography mt={'2rem'} variant="h5">
              Notifications
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <SingleSelectBoxFormField name="SendEmail" label="Enable Email Notifications" />
          </Grid>
          <Grid item xs={12}>
            <EmailChipFormField name="To" label="To" />
          </Grid>
          <Grid item xs={12}>
            <EmailChipFormField name="CC" label="CC" />
          </Grid>
        </Grid>
      </FormProvider>
      <LoadingButton
        loading={submitting}
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid) {
            const formValues = formMethods.getValues();
            const newAgency: AgencyAdd = {
              Name: formValues.Name,
              Code: formValues.Code,
              Description: formValues.Description,
              ParentId: formValues.ParentId,
              SendEmail: formValues.SendEmail,
              Email: formValues.To?.join(';'),
              CCEmail: formValues.CC?.join(';'),
              IsDisabled: false,
              SortOrder: 0,
            };
            submit(newAgency).then((res) => {
              if (res && res.ok) navigate('/admin/agencies');
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

export default AddAgency;
