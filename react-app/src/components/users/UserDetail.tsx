import React, { useContext, useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Grid, Typography } from '@mui/material';
import { statusChipFormatter } from '@/utilities/formatters';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { User } from '@/hooks/api/useUsersApi';
import { AuthContext } from '@/contexts/authContext';
import { Agency } from '@/hooks/api/useAgencyApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useGroupedAgenciesApi } from '@/hooks/api/useGroupedAgenciesApi';
import { useParams } from 'react-router-dom';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { Role, Roles } from '@/constants/roles';
import { LookupContext } from '@/contexts/lookupContext';
import { getProvider, validateEmail } from '@/utilities/helperFunctions';

interface IUserDetail {
  onClose: () => void;
}

interface UserProfile extends User {
  Provider: string;
}

const UserDetail = ({ onClose }: IUserDetail) => {
  const { id } = useParams();
  const { pimsUser } = useContext(AuthContext);
  const { data: lookupData, getLookupValueById } = useContext(LookupContext);
  const api = usePimsApi();

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const { data, refreshData, isLoading } = useDataLoader(() => api.users.getUserById(id));
  const { submit, submitting } = useDataSubmitter(api.users.updateUser);

  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const rolesOptions = useMemo(
    () => lookupData?.Roles?.map((role) => ({ label: role.Name, value: role.Name })) ?? [],
    [lookupData],
  );

  const userStatusData = {
    Status: data?.Status,
    Role: lookupData?.Roles?.find((role) => role.Id === data?.RoleId),
  };

  const provider = useMemo(
    () => getProvider(data?.Username, lookupData?.Config.bcscIdentifier),
    [data],
  );

  const userProfileData = {
    Provider: provider,
    Email: data?.Email,
    FirstName: data?.FirstName,
    LastName: data?.LastName,
    Agency: getLookupValueById('Agencies', data?.AgencyId),
    Position: data?.Position,
    CreatedOn: data?.CreatedOn ? new Date(data?.CreatedOn) : undefined,
    LastLogin: data?.LastLogin ? new Date(data?.LastLogin) : undefined,
  };

  const customFormatterStatus = (key: keyof User, val: any) => {
    if (key === 'Status') {
      return val ? statusChipFormatter(val) : <></>;
    } else if (key === 'Role' && val) {
      return <Typography>{(val as Role).Name}</Typography>;
    }
  };

  const customFormatterProfile = (key: keyof UserProfile, val: any) => {
    if (key === 'Agency' && val) {
      return <Typography>{(val as Agency).Name}</Typography>;
    }
  };

  const profileFormMethods = useForm({
    defaultValues: {
      Provider: '',
      Email: '',
      FirstName: '',
      LastName: '',
      AgencyId: null,
      Position: '',
    },
  });

  const statusFormMethods = useForm({
    defaultValues: {
      Status: '',
      Role: '',
    },
    mode: 'onBlur',
  });

  const canEdit = pimsUser.hasOneOfRoles([Roles.ADMIN]);

  useEffect(() => {
    refreshData();
  }, [id]);

  useEffect(() => {
    profileFormMethods.reset({
      Provider: provider,
      Email: userProfileData.Email,
      FirstName: userProfileData.FirstName,
      LastName: userProfileData.LastName,
      AgencyId: userProfileData.Agency?.Id ?? null,
      Position: userProfileData.Position,
    });
    statusFormMethods.reset({
      Status: userStatusData.Status,
      Role: userStatusData.Role?.Name,
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
        disableDelete={true}
        navigateBackTitle={'Back to User Overview'}
        deleteTitle={'Delete Account'}
        onBackClick={() => onClose()}
        deleteButtonProps={{ disabled: pimsUser.data?.Id === id }}
      />
      <DataCard
        loading={isLoading}
        customFormatter={customFormatterStatus}
        values={userStatusData}
        title={'User Status'}
        disableEdit={!canEdit}
        onEdit={() => setOpenStatusDialog(true)}
      />
      <DataCard
        loading={isLoading}
        customFormatter={customFormatterProfile}
        values={userProfileData}
        title={'User Profile'}
        disableEdit={!canEdit}
        onEdit={() => setOpenProfileDialog(true)}
      />
      <ConfirmDialog
        title={'Update User Profile'}
        open={openProfileDialog}
        confirmButtonProps={{ loading: submitting }}
        onConfirm={async () => {
          const isValid = await profileFormMethods.trigger();
          if (isValid) {
            const formValues = profileFormMethods.getValues();
            formValues.Provider = undefined;
            submit(id, {
              Id: id,
              ...formValues,
            }).then(() => {
              refreshData();
              setOpenProfileDialog(false);
            });
          }
        }}
        onCancel={async () => setOpenProfileDialog(false)}
      >
        <FormProvider {...profileFormMethods}>
          <Grid mt={'1rem'} spacing={2} container>
            <Grid item xs={6}>
              <TextFormField fullWidth name={'Provider'} label={'Provider'} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextFormField
                required
                fullWidth
                name={'Email'}
                label={'Email'}
                rules={{
                  validate: (value: string) => validateEmail(value) || 'Invalid email.',
                }}
              />
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
                disableClearable={false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFormField name={'Position'} fullWidth label={'Position'} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update User Status'}
        open={openStatusDialog}
        confirmButtonProps={{ loading: submitting }}
        onConfirm={async () => {
          const isValid = await statusFormMethods.trigger();
          if (isValid) {
            const formValues = statusFormMethods.getValues();
            submit(id, {
              Id: id,
              Status: formValues.Status,
              Role: lookupData?.Roles.find((role) => role.Name === formValues.Role) as Role,
            }).then(() => {
              refreshData();
              setOpenStatusDialog(false);
            });
          }
        }}
        onCancel={async () => setOpenStatusDialog(false)}
      >
        <FormProvider {...statusFormMethods}>
          <Grid minWidth={'30rem'} mt={1} spacing={2} container>
            <Grid item xs={6}>
              <AutocompleteFormField
                name={'Status'}
                label={'Status'}
                options={[
                  //TODO: Get these through a lookup endpoint.
                  { label: 'Active', value: 'Active' },
                  { label: 'On Hold', value: 'OnHold' },
                  { label: 'Disabled', value: 'Disabled' },
                  { label: 'Denied', value: 'Denied' },
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

export default UserDetail;
