import React, { useState } from 'react';
import pendingImage from '@/assets/images/pending.svg';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import TextInput from '@/components/form/TextFormField';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { FormProvider, useForm } from 'react-hook-form';
import { accessPendingBlurb, signupTermsAndConditionsClaim } from '@/constants/jsxSnippets';

const AccessPending = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      textAlign={'center'}
      gap={'2rem'}
    >
      <img width={'300px'} src={pendingImage} />
      <Typography>{accessPendingBlurb}</Typography>
    </Box>
  );
};

const RequestForm = ({ submitHandler }: { submitHandler: (d: any) => void }) => {
  const keycloak = useKeycloak();

  const formMethods = useForm({
    defaultValues: {
      UserName: keycloak.state.userInfo.idir_username,
      FirstName: keycloak.state.userInfo.given_name,
      LastName: keycloak.state.userInfo.family_name,
      Email: keycloak.state.userInfo.email,
      Notes: '',
      Agency: '',
      Position: '',
    },
  });

  const placeholderData = [
    { label: 'BC Ministry of Education', value: 'key1' },
    { label: 'BC Ministry of Health', value: 'key2' },
    { label: 'BC Electric & Hydro', value: 'key3' },
  ];

  return (
    <>
      <FormProvider {...formMethods}>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              name={'UserName'}
              label={'IDIR/BCeID'}
              defaultValue={keycloak.state.userInfo.idir_username}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              name={'Email'}
              label={'Email'}
              defaultValue={keycloak.state.userInfo.email}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              name={'FirstName'}
              label={'First name'}
              defaultValue={keycloak.state.userInfo.given_name}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name={'LastName'}
              fullWidth
              label={'Last name'}
              defaultValue={keycloak.state.userInfo.family_name}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'Agency'}
              label={'Your agency'}
              options={placeholderData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput name={'Position'} fullWidth label={'Your position'} />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name={'Notes'}
              multiline
              fullWidth
              label={'Notes (e.g. Reason for access)'}
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Box mt={'2rem'} display="flex">
        <Button
          onClick={formMethods.handleSubmit(submitHandler)}
          variant="contained"
          color="primary"
          sx={{ width: '6rem', marginX: 'auto' }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export const AccessRequest = () => {
  const [requestSent, setRequestSent] = useState(false);

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
    setRequestSent(true);
  };

  return (
    <Box display="flex" flexDirection={'column'} width="600px" marginX="auto">
      <Paper sx={{ padding: '2rem', borderRadius: '32px' }}>
        <Typography mb={'2rem'} variant="h2">
          {requestSent ? 'Access Request' : 'Access Pending'}
        </Typography>
        {requestSent ? <AccessPending /> : <RequestForm submitHandler={onSubmit} />}
      </Paper>

      <Typography mt={'1rem'} textAlign={'center'}>
        {signupTermsAndConditionsClaim}
      </Typography>
    </Box>
  );
};
