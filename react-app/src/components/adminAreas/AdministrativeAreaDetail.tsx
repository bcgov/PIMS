import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { Box, Checkbox, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailViewNavigation from '../display/DetailViewNavigation';
import DataCard from '../display/DataCard';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import TextFormField from '../form/TextFormField';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import useDataSubmitter from '@/hooks/useDataSubmitter';

const AdministrativeAreaDetail = () => {
  const { id } = useParams();
  const api = usePimsApi();
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.administrativeAreas.getAdminAreaById(Number(id)),
  );
  const { data: regionalDistricts, loadOnce: loadDistricts } = useDataLoader(
    api.lookup.getRegionalDistricts,
  );
  loadDistricts();
  const { submit, submitting } = useDataSubmitter(api.administrativeAreas.updateAdminArea);
  const navigate = useNavigate();
  useEffect(() => {
    refreshData();
  }, [id]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const customFormatter = (key: keyof AdministrativeArea, val: any) => {
    if (key === 'IsDisabled') {
      return (
        <Checkbox
          checked={val}
          disabled
          sx={{
            padding: 0,
          }}
        />
      );
    }
  };

  const adminAreaData = {
    Name: data?.Name,
    IsDisabled: data?.IsDisabled,
    CreatedOn: data?.CreatedOn,
    RegionalDistrict: data?.RegionalDistrict?.Name,
  };

  const formMethods = useForm({
    defaultValues: {
      Name: '',
      IsDisabled: null,
      RegionalDistrictId: null,
    },
  });

  useEffect(() => {
    formMethods.reset({
      Name: data?.Name,
      IsDisabled: data?.IsDisabled,
      RegionalDistrictId: data?.RegionalDistrictId,
    });
  }, [data]);
  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      flexDirection={'column'}
      width={'46rem'}
      marginX={'auto'}
    >
      <DetailViewNavigation
        navigateBackTitle="Back to Administrative Area Overview"
        deleteTitle="Delete Area"
        onBackClick={() => navigate('/admin/adminAreas')}
        disableDelete={true}
      />
      <DataCard
        loading={isLoading}
        customFormatter={customFormatter}
        values={adminAreaData}
        title={'Administrative Area Details'}
        onEdit={() => setOpenEditDialog(true)}
      />
      <ConfirmDialog
        title={'Update Administrative Area'}
        open={openEditDialog}
        confirmButtonProps={{
          loading: submitting,
        }}
        onConfirm={async () => {
          const valid = await formMethods.trigger();
          if (valid) {
            const formValues = formMethods.getValues();
            const idAsNumber = Number(id);
            submit(idAsNumber, {
              ...formValues,
              Id: idAsNumber,
            }).then(() => {
              refreshData();
              setOpenEditDialog(false);
            });
          }
        }}
        onCancel={async () => setOpenEditDialog(false)}
      >
        <FormProvider {...formMethods}>
          <Grid spacing={2} container>
            <Grid mt={2} item xs={12}>
              <TextFormField required fullWidth name={'Name'} label={'Name'} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteFormField
                required
                options={
                  regionalDistricts?.map((dist) => ({ label: dist.Name, value: dist.Id })) ?? []
                }
                name={'RegionalDistrictId'}
                label={'Regional District'}
              />
            </Grid>
            <Grid item xs={12}>
              <SingleSelectBoxFormField name={'IsDisabled'} label={'Is Disabled'} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
    </Box>
  );
};

export default AdministrativeAreaDetail;
