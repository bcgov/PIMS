import React, { useContext } from 'react';
import pendingImage from '@/assets/images/pending.svg';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  accessPendingBlurb,
  accountInactiveBlurb,
  awaitingRoleBlurb,
  signupTermsAndConditionsClaim,
} from '@/constants/jsxSnippets';
import usePimsApi from '@/hooks/usePimsApi';
import { AccessRequest as AccessRequestType } from '@/hooks/api/useUsersApi';
import { AuthContext } from '@/contexts/authContext';
import { Navigate } from 'react-router-dom';
import TextFormField from '@/components/form/TextFormField';
import { useGroupedAgenciesApi } from '@/hooks/api/useGroupedAgenciesApi';
import { SnackBarContext } from '@/contexts/snackbarContext';

interface StatusPageTemplateProps {
  blurb: JSX.Element;
}
const StatusPageTemplate = (props: StatusPageTemplateProps) => {
  const { blurb } = props;
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      textAlign={'center'}
      gap={'2rem'}
    >
      <img width={'300px'} src={pendingImage} />
      <Typography>{blurb}</Typography>
    </Box>
  );
};

const RequestForm = ({ submitHandler }: { submitHandler: (d: any) => void }) => {
  const keycloak = useSSO();
  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const formMethods = useForm({
    defaultValues: {
      UserName: keycloak.user?.username,
      FirstName: keycloak.user?.first_name,
      LastName: keycloak.user?.last_name,
      Email: keycloak.user?.email,
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
  const snackbar = useContext(SnackBarContext);

  const onSubmit = (data: AccessRequestType) => {
    api.users.submitAccessRequest(data).then((response) => {
      if (response.status === 201) {
        auth.pimsUser.refreshData();
      } else {
        snackbar.setMessageState({
          text: 'Could not create account. Contact pimshelp@gov.bc.ca for assistance.',
          open: true,
          style: snackbar.styles.warning,
        });
      }
    });
  };

  if (
    auth.pimsUser?.data?.Status &&
    auth.pimsUser.data?.Status === 'Active' &&
    auth.keycloak.user?.client_roles?.length
  ) {
    return <Navigate replace to={'/'} />;
  }

  const selectPageContent = () => {
    if (auth.pimsUser.data?.Status === 'Active' && !auth.keycloak.user?.client_roles?.length) {
      return (
        <>
          <Typography mb={'2rem'} variant="h2">
            Awaiting Role
          </Typography>
          <StatusPageTemplate blurb={awaitingRoleBlurb} />
        </>
      );
    }
    switch (auth.pimsUser.data?.Status) {
      case 'OnHold':
        return (
          <>
            <Typography mb={'2rem'} variant="h2">
              Access Pending
            </Typography>
            <StatusPageTemplate blurb={accessPendingBlurb} />
          </>
        );
      case 'Disabled':
      case 'Denied':
        return (
          <>
            <Typography mb={'2rem'} variant="h2">
              Account Inactive
            </Typography>
            <StatusPageTemplate blurb={accountInactiveBlurb} />
          </>
        );
      default:
        return (
          <>
            <Typography mb={'2rem'} variant="h2">
              Access Request
            </Typography>
            <RequestForm submitHandler={onSubmit} />
          </>
        );
    }
  };

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
        {selectPageContent()}
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
