import { Box, Grid, Typography, Button } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import { useNavigate } from 'react-router-dom';

const AddAdministrativeArea = () => {
  const api = usePimsApi();
  const { data: regionalDistricts, loadOnce: loadRegional } = useDataLoader(
    api.lookup.getRegionalDistricts,
  );
  loadRegional();
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      RegionalDistrictId: null,
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
      <Box>
        <NavigateBackButton
          navigateBackTitle={'Back to administrative areas'}
          onBackClick={() => navigate('/admin/adminAreas')}
        />
      </Box>
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
              required
              name={'RegionalDistrictId'}
              label={'Regional District'}
              options={regionalDistricts?.map((reg) => ({ value: reg.Id, label: reg.Name })) ?? []}
            />
          </Grid>
        </Grid>
        <Button
          onClick={async () => {
            const isValid = await formMethods.trigger();
            const formValues = formMethods.getValues();
            if (isValid) {
              api.administrativeAreas
                .addAdministrativeArea({
                  ...formValues,
                  IsDisabled: false,
                  ProvinceId: 'BC',
                  SortOrder: Number(formValues.SortOrder),
                })
                .then(() => navigate('/admin/adminAreas'));
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