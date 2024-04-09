import React, { useContext, useEffect, useMemo, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Grid, Typography } from '@mui/material';
import { statusChipFormatter } from '@/utils/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAccountConfirmText } from '@/constants/strings';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { User } from '@/hooks/api/useUsersApi';
import { AuthContext } from '@/contexts/authContext';
import { Agency } from '@/hooks/api/useAgencyApi';
import { Role } from '@/hooks/api/useRolesApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useGroupedAgenciesApi } from '@/hooks/api/useGroupedAgenciesApi';
import { useParams } from 'react-router-dom';

interface IUserDetail {
  onClose: () => void;
}

interface UserProfile extends User {
  Provider: string;
}

const UserDetail = ({ onClose }: IUserDetail) => {
  const { id } = useParams();
  const { pimsUser } = useContext(AuthContext);
  const api = usePimsApi();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const { data, refreshData } = useDataLoader(() => api.users.getUserById(id));

  const { data: rolesData, loadOnce: loadRoles } = useDataLoader(api.roles.getInternalRoles);
  loadRoles();

  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const rolesOptions = useMemo(
    () => rolesData?.map((role) => ({ label: role.Name, value: role.Name })) ?? [],
    [rolesData],
  );

  const userStatusData = {
    Status: data?.Status,
    Role: data?.Role,
  };

  const userProfileData = {
    Provider: data?.Username.includes('idir') ? 'IDIR' : 'BCeID',
    Email: data?.Email,
    FirstName: data?.FirstName,
    LastName: data?.LastName,
    Agency: data?.Agency,
    Position: data?.Position,
    CreatedOn: data?.CreatedOn ? new Date(data?.CreatedOn) : undefined,
    LastLogin: data?.LastLogin ? new Date(data?.LastLogin) : undefined,
  };

  const customFormatterStatus = (key: keyof User, val: any) => {
    if (key === 'Status') {
      return statusChipFormatter(val);
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

  useEffect(() => {
    refreshData();
  }, [id]);

  useEffect(() => {
    profileFormMethods.reset({
      Provider: data?.Username.includes('idir') ? 'IDIR' : 'BCeID',
      Email: userProfileData.Email,
      FirstName: userProfileData.FirstName,
      LastName: userProfileData.LastName,
      AgencyId: userProfileData.Agency?.Id,
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
        navigateBackTitle={'Back to User Overview'}
        deleteTitle={'Delete Account'}
        onDeleteClick={() => setOpenDeleteDialog(true)}
        onBackClick={() => onClose()}
        deleteButtonProps={{ disabled: pimsUser.data?.Id === id }}
      />
      <DataCard
        customFormatter={customFormatterStatus}
        values={userStatusData}
        title={'User Status'}
        onEdit={() => setOpenStatusDialog(true)}
      />
      <DataCard
        customFormatter={customFormatterProfile}
        values={userProfileData}
        title={'User Profile'}
        onEdit={() => setOpenProfileDialog(true)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete account'}
        message={deleteAccountConfirmText}
        deleteText="Delete Account"
        onDelete={async () => {
          api.users.deleteUser(id).then(() => {
            setOpenDeleteDialog(false);
            onClose();
          });
        }}
        onClose={async () => setOpenDeleteDialog(false)}
      />
      <ConfirmDialog
        title={'Update User Profile'}
        open={openProfileDialog}
        onConfirm={async () => {
          const isValid = await profileFormMethods.trigger();
          if (isValid) {
            const formValues = profileFormMethods.getValues();
            // Remove Provider. Field is frontend only.
            formValues.Provider = undefined;
            api.users
              .updateUser(id, {
                Id: id,
                ...formValues,
              })
              .then(() => refreshData());
            setOpenProfileDialog(false);
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
        title={'Update User Status'}
        open={openStatusDialog}
        onConfirm={async () => {
          const isValid = await statusFormMethods.trigger();
          if (isValid) {
            await api.users.updateUserRole(data.Username, statusFormMethods.getValues().Role);
            api.users
              .updateUser(id, {
                Id: id,
                Status: statusFormMethods.getValues().Status,
              })
              .then(() => refreshData());
            setOpenStatusDialog(false);
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
