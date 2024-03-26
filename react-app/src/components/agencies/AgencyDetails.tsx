import React, { useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Grid, Typography } from '@mui/material';
import { dateFormatter, statusChipFormatter } from '@/utils/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAccountConfirmText } from '@/constants/strings';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Agency } from '@/hooks/api/useAgencyApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useGroupedAgenciesApi } from '@/hooks/api/useGroupedAgenciesApi';
import { useParams } from 'react-router-dom';

interface IAgencyDetail {
  onClose: () => void;
}

interface AgencyStatus extends Agency {
  Status: string;
}

const AgencyDetail = ({ onClose }: IAgencyDetail) => {
  const { id } = useParams();
  const api = usePimsApi();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const { data, refreshData } = useDataLoader(() => api.agencies.getAgencyById(+id));

  const { data: rolesData, loadOnce: loadRoles } = useDataLoader(api.roles.getInternalRoles);
  loadRoles();

  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const rolesOptions = useMemo(
    () => rolesData?.map((role) => ({ label: role.Name, value: role.Name })) ?? [],
    [rolesData],
  );

  const agencyStatusData = {
    Status: data?.IsDisabled ? 'Disabled' : 'Active',
    Name: data?.Name,
    Code: data?.Code,
    Description: data?.Description,
    Parent: data?.Parent?.Name,
    UpdatedOn: data?.UpdatedOn,
  };

  const notificationsSettingsData = {
    Email: data?.Email,
    SendTo: data?.AddressTo,
    CC: data?.CCEmail,
  };

  const customFormatterStatus = (key: keyof AgencyStatus, val: any) => {
    switch (key) {
      case 'Status':
        return statusChipFormatter(val);
      case 'UpdatedOn':
        return <Typography>{dateFormatter(val)}</Typography>;
      default:
        return <Typography>{val}</Typography>;
    }
  };

  const agencyFormMethods = useForm({
    defaultValues: {
      Status: '',
      Name: '',
      Code: '',
      Parent: '',
      Description: '',
    },
  });

  const emailFormMethods = useForm({
    defaultValues: {
      Email: '',
      SendTo: '',
      CC: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    refreshData();
  }, [id]);

  useEffect(() => {
    agencyFormMethods.reset({
      Status: agencyStatusData.Status,
      Name: agencyStatusData.Name,
      Code: agencyStatusData.Code,
      Parent: agencyStatusData.Parent,
      Description: agencyStatusData.Description,
    });
    emailFormMethods.reset({
      Email: notificationsSettingsData.Email,
      SendTo: notificationsSettingsData.SendTo,
      CC: notificationsSettingsData.CC,
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
        navigateBackTitle={'Back to Agency Overview'}
        deleteTitle={'Delete Agency'}
        onDeleteClick={() => setOpenDeleteDialog(true)}
        onBackClick={() => onClose()}
      />
      <DataCard
        customFormatter={customFormatterStatus}
        values={agencyStatusData}
        title={'Agency Status'}
        onEdit={() => setOpenStatusDialog(true)}
      />
      <DataCard
        values={notificationsSettingsData}
        title={'Notification Settings'}
        onEdit={() => setOpenProfileDialog(true)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete Agency'}
        message={deleteAccountConfirmText}
        deleteText="Delete Agency"
        onDelete={async () => {
          api.agencies.deleteAgencyById(+id).then(() => {
            setOpenDeleteDialog(false);
            onClose();
          });
        }}
        onClose={async () => setOpenDeleteDialog(false)}
      />
      <ConfirmDialog
        title={'Update Agency'}
        open={openProfileDialog}
        onConfirm={async () => {
          const isValid = await agencyFormMethods.trigger();
          if (isValid) {
            api.users
              .updateUser(id, { Id: id, ...agencyFormMethods.getValues() })
              .then(() => refreshData());
            setOpenProfileDialog(false);
          }
        }}
        onCancel={async () => setOpenProfileDialog(false)}
      >
        <FormProvider {...agencyFormMethods}>
          <Grid mt={'1rem'} spacing={2} container>
            <Grid item xs={6}>
              <TextFormField fullWidth name={'DisplayName'} label={'IDIR/BCeID'} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextFormField required fullWidth name={'Email'} label={'Email'} />
            </Grid>
            <Grid item xs={6}>
              <TextFormField required fullWidth name={'FirstName'} label={'First Name'} />
            </Grid>
            <Grid item xs={6}>
              <TextFormField required fullWidth name={'LastName'} label={'Last Name'} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteFormField
                allowNestedIndent
                name={'AgencyId'}
                label={'Agency'}
                options={agencyOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFormField name={'Position'} fullWidth label={'Position'} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update Agency Status'}
        open={openStatusDialog}
        onConfirm={async () => {
          const isValid = await emailFormMethods.trigger();
          if (isValid) {
            // await api.users.updateUserRole(data.Username, emailFormMethods.getValues().Role);
            // api.users
            //   .updateUser(id, {
            //     Id: id,
            //     Status: emailFormMethods.getValues().Status,
            //   })
            //   .then(() => refreshData());
            setOpenStatusDialog(false);
          }
        }}
        onCancel={async () => setOpenStatusDialog(false)}
      >
        <FormProvider {...emailFormMethods}>
          <Grid minWidth={'30rem'} mt={1} spacing={2} container>
            <Grid item xs={6}>
              <AutocompleteFormField
                name={'Status'}
                label={'Status'}
                options={[
                  //TODO: Get these through a lookup endpoint.
                  { label: 'Active', value: 'Active' },
                  { label: 'Disabled', value: 'Disabled' },
                ]}
              />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteFormField name={'Role'} label={'Role'} options={rolesOptions} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
    </Box>
  );
};

export default AgencyDetail;
