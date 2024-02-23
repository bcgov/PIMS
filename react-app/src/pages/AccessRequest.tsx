import React, { useContext, useMemo } from 'react';
import pendingImage from '@/assets/images/pending.svg';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import TextInput from '@/components/form/TextFormField';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { FormProvider, useForm } from 'react-hook-form';
import { accessPendingBlurb, signupTermsAndConditionsClaim } from '@/constants/jsxSnippets';
import usePimsApi from '@/hooks/usePimsApi';
import { AccessRequest as AccessRequestType } from '@/hooks/api/useUsersApi';
import { AuthContext } from '@/contexts/authContext';
import useDataLoader from '@/hooks/useDataLoader';
import { Navigate } from 'react-router-dom';

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
  const api = usePimsApi();

  const { loadOnce: agencyLoad, data: agencyData } = useDataLoader(api.agencies.getAgencies);
  agencyLoad();

  const agencyOptions = useMemo(
    () => agencyData?.map((agency) => ({ label: agency.Name, value: agency.Id })) ?? [],
    [agencyData],
  );

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
              required
              name={'AgencyId'}
              label={'Your agency'}
              options={agencyOptions ?? []}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput name={'Position'} fullWidth label={'Your position'} />
          </Grid>
          <Grid item xs={12}>
            <TextInput name={'Note'} multiline fullWidth label={'Notes (e.g. Reason for access)'} />
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
