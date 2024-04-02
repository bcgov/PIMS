import { Box, Grid, Typography, Button } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';

const AddAdministrativeArea = () => {
  const api = usePimsApi();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      RegionalDistrict: '',
      SortOrder: '0',
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
    >
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add new administrative area
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField required name={'Name'} label={'Name'} />
          </Grid>
          <Grid item xs={12}>
            <TextFormField required name={'SortOrder'} label={'Sort Order'} numeric />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'RegionalDistrictId'}
              label={'Regional District'}
              options={[]}
            />
          </Grid>
        </Grid>
        <Button
          onClick={async () => {
            const isValid = await formMethods.trigger();
            const formValues = formMethods.getValues();
            if (isValid) {
              api.administrativeAreas.addAdministrativeArea({ ...formValues, ProvinceId: 'BC' });
            } else {
              console.log('Error!');
            }
          }}
          variant="contained"
          color="primary"
          sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
        >
          Submit
        </Button>
      </FormProvider>
    </Box>
  );
};

export default AddAdministrativeArea;
