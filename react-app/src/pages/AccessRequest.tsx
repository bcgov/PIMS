import React, { useContext } from 'react';
import pendingImage from '@/assets/images/pending.svg';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { FormProvider, useForm } from 'react-hook-form';
import { accessPendingBlurb, signupTermsAndConditionsClaim } from '@/constants/jsxSnippets';
import usePimsApi from '@/hooks/usePimsApi';
import { AccessRequest as AccessRequestType } from '@/hooks/api/useUsersApi';
import { AuthContext } from '@/contexts/authContext';
import { Navigate } from 'react-router-dom';
import TextFormField from '@/components/form/TextFormField';
import { useGroupedAgenciesApi } from '@/hooks/api/useGroupedAgenciesApi';

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
  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const formMethods = useForm({
    defaultValues: {
      UserName: keycloak.state.userInfo.idir_username || keycloak.state.userInfo.bceid_username,
      FirstName: keycloak.state.userInfo.given_name || keycloak.state.userInfo.display_name,
      LastName: keycloak.state.userInfo.family_name,
      Email: keycloak.state.userInfo.email,
      Notes: '',
      Agency: '',
      Position: '',
    },
  });

  return (
    <>
      <FormProvider {...formMethods}>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'UserName'} label={'IDIR/BCeID'} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'Email'} label={'Email'} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'FirstName'} label={'First name'} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextFormField name={'LastName'} fullWidth label={'Last name'} disabled />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              required
              allowNestedIndent
              name={'AgencyId'}
              label={'Your agency'}
              options={agencyOptions ?? []}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField name={'Position'} fullWidth label={'Your position'} />
          </Grid>
          <Grid item xs={12}>
            <TextFormField
              name={'Note'}
              multiline
              fullWidth
              label={'Notes (e.g. Reason for access)'}
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Box mt={'2rem'} display="flex">
        <Button
          onClick={async () => {
            const isValid = await formMethods.trigger();
            if (isValid) {
              submitHandler(formMethods.getValues());
            }
          }}
          variant="contained"
          color="primary"
          sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export const AccessRequest = () => {
  const api = usePimsApi();
  const auth = useContext(AuthContext);

  const onSubmit = async (data: AccessRequestType) => {
    try {
      await api.users.submitAccessRequest(data);
      await auth.pimsUser.refreshData();
    } catch (e) {
      //Maybe we can display a little snackbar in these cases at some point.
      // eslint-disable-next-line no-console
      console.log(e?.message);
    }
  };

  if (auth.pimsUser?.data?.Status && auth.pimsUser.data.Status === 'Active') {
    return <Navigate replace to={'/'} />;
  }

  return (
    <Box
      display="flex"
      flexDirection={'column'}
      width="600px"
      marginX="auto"
      alignSelf={'center'}
      mt={'4rem'}
    >
      <Paper
        sx={{
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Typography mb={'2rem'} variant="h2">
          {auth.pimsUser.data ? 'Access Pending' : 'Access Request'}
        </Typography>
        {auth.pimsUser?.data?.Status && auth.pimsUser.data.Status === 'OnHold' ? (
          <AccessPending />
        ) : (
          <RequestForm submitHandler={onSubmit} />
        )}
      </Paper>

      <Typography
        lineHeight={1.8}
        marginX={'6em'}
        fontSize={'0.8rem'}
        mt={'1rem'}
        textAlign={'center'}
      >
        {signupTermsAndConditionsClaim}
      </Typography>
    </Box>
  );
};
