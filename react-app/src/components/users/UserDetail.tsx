import React, { useState } from 'react';
import DataCard from '../display/DataCard';
import { Avatar, Box, Button, Grid, IconButton, Typography, useTheme } from '@mui/material';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { statusChipFormatter } from '@/utils/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAccountConfirmText } from '@/constants/strings';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@/components/form/TextFormField';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';

const UserDetail = () => {
  const theme = useTheme();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  interface User {
    Status: string;
  } //Placeholder type.

  //Backend hooks etc would go here.
  const userStatusData = {
    Status: 'Active',
    Role: 'System Admin',
    Created: new Date(),
    LastLogin: new Date(),
  };
  const userProfileData = {
    DisplayName: 'GSTEWART@idir',
    Email: 'graham.stewart@gov.bc.ca',
    FirstName: 'Graham',
    LastName: 'Stewart',
    Agency: 'BC Housing',
    Position: 'Senior Director',
  };
  const customFormatter = (key: keyof User, val: any) => {
    if (key === 'Status') {
      return statusChipFormatter(val);
    }
  };

  const agencyData = [
    { label: 'BC Ministry of Education', value: 'key1' },
    { label: 'BC Ministry of Health', value: 'key2' },
    { label: 'BC Electric & Hydro', value: 'key3' },
  ];

  const profileFormMethods = useForm({
    defaultValues: {
      DisplayName: userProfileData.DisplayName,
      Email: userProfileData.Email,
      FirstName: userProfileData.FirstName,
      LastName: userProfileData.LastName,
      Agency: userProfileData.Agency,
      Position: userProfileData.Position,
    },
  });

  const statusFormMethods = useForm({
    defaultValues: {
      Status: userStatusData.Status,
      Role: userStatusData.Role,
    },
  });

  return (
    <Box display={'flex'} gap={'1rem'} mt={'2rem'} flexDirection={'column'}>
      <Box display={'flex'} alignItems={'center'}>
        <IconButton onClick={() => {}}>
          <Avatar
            style={{ color: 'white', backgroundColor: 'white' }} //For some reason this doesn't get applied if you do it in sx props.
            sx={{ border: '0.1px solid lightgray' }}
          >
            <Icon color="black" size={0.9} path={mdiArrowLeft} />
          </Avatar>
        </IconButton>
        <Typography variant="h5">Back to User Overview</Typography>
        <Button
          onClick={() => setOpenDeleteDialog(true)}
          sx={{ fontWeight: 'bold', color: theme.palette.warning.main, marginLeft: 'auto' }}
        >
          Delete Account
        </Button>
      </Box>
      <DataCard
        customFormatter={customFormatter}
        values={userStatusData}
        title={'User Status'}
        onEdit={() => setOpenStatusDialog(true)}
      />
      <DataCard
        values={userProfileData}
        title={'User Profile'}
        onEdit={() => setOpenProfileDialog(true)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete account'}
        message={deleteAccountConfirmText}
        deleteText="Delete Account"
        onDelete={function (): void {
          throw new Error('Function not implemented.');
        }}
        onClose={() => setOpenDeleteDialog(false)}
      />
      <ConfirmDialog
        title={'Update User Profile'}
        open={openProfileDialog}
        onConfirm={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCancel={() => setOpenProfileDialog(false)}
      >
        <FormProvider {...profileFormMethods}>
          <Grid mt={'1rem'} spacing={2} container>
            <Grid item xs={6}>
              <TextInput fullWidth name={'DisplayName'} label={'IDIR/BCeID'} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextInput fullWidth name={'Email'} label={'Email'} />
            </Grid>
            <Grid item xs={6}>
              <TextInput fullWidth name={'FirstName'} label={'First Name'} />
            </Grid>
            <Grid item xs={6}>
              <TextInput fullWidth name={'LastName'} label={'Last Name'} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteFormField name={'Agency'} label={'Agency'} options={agencyData} />
            </Grid>
            <Grid item xs={12}>
              <TextInput name={'Position'} fullWidth label={'Position'} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update User Status'}
        open={openStatusDialog}
        onConfirm={() => {}}
        onCancel={() => setOpenStatusDialog(false)}
      >
        <FormProvider {...statusFormMethods}>
          <Grid minWidth={'30rem'} mt={1} spacing={2} container>
            <Grid item xs={6}>
              <AutocompleteFormField
                name={'Status'}
                label={'Status'}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Hold', value: 'Hold' },
                ]}
              />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteFormField name={'Role'} label={'Role'} options={agencyData} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
    </Box>
  );
};

export default UserDetail;
