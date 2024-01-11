import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import TextInput from '@/components/form/TextInput';
import AutocompleteInput from '@/components/form/AutocompleteInput';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

export const AccessRequest = () => {
  const keycloak = useKeycloak();

  const placeholderData = [
    { label: 'BC Ministry of Education', value: 'key1' },
    { label: 'BC Ministry of Health', value: 'key2' },
    { label: 'BC Electric & Hydro', value: 'key3' },
  ];

  return (
    <Box display="flex" flexDirection={'column'} width="600px" marginX="auto">
      <Paper sx={{ padding: '2rem', borderRadius: '32px' }}>
        <Typography mb={'2rem'} variant="h2">
          Access Request
        </Typography>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              label={'IDIR/BCeID'}
              defaultValue={keycloak.state.userInfo.idir_username}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              label={'Email'}
              defaultValue={keycloak.state.userInfo.email}
              disabled
            ></TextInput>
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              label={'First name'}
              defaultValue={keycloak.state.userInfo.given_name}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              label={'Last name'}
              defaultValue={keycloak.state.userInfo.family_name}
              disabled
            ></TextInput>
          </Grid>
          <Grid item xs={12}>
            <AutocompleteInput
              label={'Your agency'}
              //required={true}
              options={placeholderData}
            ></AutocompleteInput>
          </Grid>
          <Grid item xs={12}>
            <TextInput fullWidth label={'Your position'}></TextInput>
          </Grid>
          <Grid item xs={12}>
            <TextInput multiline fullWidth label={'Notes (e.g. Reason for access)'}></TextInput>
          </Grid>
        </Grid>
        <Box mt={'2rem'} display="flex">
          <Button variant="contained" color="primary" sx={{ width: '150px', marginX: 'auto' }}>
            Submit
          </Button>
        </Box>
      </Paper>
      <Typography mt={'1rem'} textAlign={'center'}>
        By signing up, you agree to <a href="#">Terms and Conditions</a> and that you have read
        <a href="#">Privacy Policy</a>.
      </Typography>
    </Box>
  );
};
