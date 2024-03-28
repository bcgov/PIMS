import TextFormField from '@/components/form/TextFormField';
import { Box, Button, Grid, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
// import usePimsApi from '@/hooks/usePimsApi';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';
import EmailChipFormField from '@/components/form/EmailChipFormField';
import SingleSelectBoxFormField from '@/components/form/SingleSelectBoxFormField';

const AddAgency = () => {
  const [showErrorText, setShowErrorTest] = useState(false);

  // const api = usePimsApi();

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
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
      boxShadow={'2em'}
    >
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add New Agency
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField fullWidth name={'Name'} label={`Agency Name`} />
          </Grid>
          <Grid item xs={12}>
            <TextFormField fullWidth name={'Code'} label={`Agency Code`} />
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
              options={agencyOptions}
              allowNestedIndent={true}
            />
          </Grid>
          <Grid item xs={12}>
            {' '}
            <Typography mt={'2rem'} variant="h3">
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
      {showErrorText && (
        <Typography alignSelf={'center'} variant="h5" color={'error'}>
          Please correct issues in the form input.
        </Typography>
      )}
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid) {
            console.log(JSON.stringify(formMethods.getValues(), null, 2));
            setShowErrorTest(false);
          } else {
            console.log('Error!');
            setShowErrorTest(true);
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

export default AddAgency;
