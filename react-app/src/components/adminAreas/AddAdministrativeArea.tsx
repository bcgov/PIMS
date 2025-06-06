import { Box, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';
import { LookupContext } from '@/contexts/lookupContext';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';

const AddAdministrativeArea = () => {
  const api = usePimsApi();
  const { data: lookupData, refreshLookup } = useContext(LookupContext);
  const { submit, submitting } = useDataSubmitter(api.administrativeAreas.addAdministrativeArea);
  const { goToFromStateOrSetRoute } = useHistoryAwareNavigate();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      RegionalDistrictId: null,
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
          navigateBackTitle={'Back to Administrative Area Overview'}
          onBackClick={() => goToFromStateOrSetRoute('/admin/adminAreas')}
        />
      </Box>
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add New Administrative Area
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField required name={'Name'} label={'Name'} />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              required
              name={'RegionalDistrictId'}
              label={'Regional District'}
              options={
                lookupData?.RegionalDistricts?.map((reg) => ({ value: reg.Id, label: reg.Name })) ??
                []
              }
            />
          </Grid>
        </Grid>
        <LoadingButton
          loading={submitting}
          onClick={async () => {
            const isValid = await formMethods.trigger();
            const formValues = formMethods.getValues();
            if (isValid) {
              submit({
                ...formValues,
                IsDisabled: false,
                ProvinceId: 'BC',
              }).then((resp) => {
                if (resp && resp.ok) {
                  refreshLookup();
                  goToFromStateOrSetRoute('/admin/adminAreas');
                }
              });
            } else {
              console.log('Error!');
            }
          }}
          variant="contained"
          color="primary"
          sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
        >
          Submit
        </LoadingButton>
      </FormProvider>
    </Box>
  );
};

export default AddAdministrativeArea;
