import React, { useEffect, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { dateFormatter, statusChipFormatter } from '@/utilities/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAgencyConfirmText } from '@/constants/strings';
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
import EmailChipFormField from '@/components/form/EmailChipFormField';
import SingleSelectBoxFormField from '@/components/form/SingleSelectBoxFormField';
import useDataSubmitter from '@/hooks/useDataSubmitter';

interface IAgencyDetail {
  onClose: () => void;
}

interface AgencyStatus extends Agency {
  Status: string;
  CC: string[];
  To: string[];
}

const AgencyDetail = ({ onClose }: IAgencyDetail) => {
  const { id } = useParams();
  const api = usePimsApi();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);

  const { data, refreshData, isLoading } = useDataLoader(() => api.agencies.getAgencyById(+id));
  const { submit, submitting } = useDataSubmitter(api.agencies.updateAgencyById);

  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  const agencyStatusData = {
    Status: data?.IsDisabled ? 'Disabled' : 'Active',
    Code: data?.Code,
    Name: data?.Name,
    Description: data?.Description,
    Parent: data?.Parent,
    UpdatedOn: data?.UpdatedOn,
  };

  const notificationsSettingsData = {
    SendEmail: data?.SendEmail,
    To: data?.Email ? data.Email.split(';') : [],
    CC: data?.CCEmail ? data.CCEmail.split(';') : [],
  };

  const customFormatter = (key: keyof AgencyStatus, val: any) => {
    switch (key) {
      case 'Status':
        return statusChipFormatter(val);
      case 'UpdatedOn':
        return <Typography>{dateFormatter(val)}</Typography>;
      case 'Parent':
        return <Typography>{(val as Agency)?.Name}</Typography>;
      case 'SendEmail':
        return <Typography>{val ? 'Yes' : 'No'}</Typography>;
      case 'To':
      case 'CC':
        return val.map((email) => (
          <Chip key={email} label={email} variant="outlined" sx={{ margin: '0 4px 4px 0' }} />
        ));
      default:
        return <Typography>{val}</Typography>;
    }
  };

  const agencyFormMethods = useForm({
    defaultValues: {
      Status: '',
      Name: '',
      Code: '',
      ParentId: undefined,
      Description: '',
    },
  });

  const notificationsFormMethods = useForm({
    defaultValues: {
      SendEmail: false,
      To: [],
      CC: [],
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
      ParentId: agencyStatusData.Parent?.Id,
      Description: agencyStatusData.Description,
    });
    notificationsFormMethods.reset({
      SendEmail: notificationsSettingsData.SendEmail,
      To: notificationsSettingsData.To,
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
        loading={isLoading}
        customFormatter={customFormatter}
        values={agencyStatusData}
        title={'Agency Details'}
        onEdit={() => setOpenStatusDialog(true)}
      />
      <DataCard
        loading={isLoading}
        customFormatter={customFormatter}
        values={notificationsSettingsData}
        title={'Notification Settings'}
        onEdit={() => setOpenNotificationsDialog(true)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete Agency'}
        message={deleteAgencyConfirmText}
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
        open={openStatusDialog}
        confirmButtonProps={{ loading: submitting }}
        onConfirm={async () => {
          const isValid = await agencyFormMethods.trigger();
          if (isValid) {
            const { Status, ParentId, Name, Code, Description } = agencyFormMethods.getValues();
            submit(+id, {
              Id: +id,
              IsDisabled: Status === 'Disabled',
              ParentId,
              Name,
              Code,
              Description,
            }).then(() => {
              refreshData();
              setOpenStatusDialog(false);
            });
          }
        }}
        onCancel={async () => setOpenStatusDialog(false)}
      >
        <FormProvider {...agencyFormMethods}>
          <Grid mt={'1rem'} spacing={2} container>
            <Grid item xs={6}>
              <AutocompleteFormField
                name={'Status'}
                label={'Status'}
                required
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Disabled', value: 'Disabled' },
                ]}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFormField required fullWidth name={'Code'} label={'Code'} />
            </Grid>
            <Grid item xs={12}>
              <TextFormField required fullWidth name={'Name'} label={'Name'} />
            </Grid>
            <Grid item xs={12}>
              <TextFormField
                fullWidth
                multiline
                name={'Description'}
                label={'Description'}
                minRows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteFormField
                allowNestedIndent
                name={'ParentId'}
                label={'Parent Agency'}
                options={agencyOptions}
                disableOptionsFunction={
                  (option) =>
                    option.value === +id || // Can't assign to self
                    agencyOptions
                      .find((parent) => parent.value === +id)
                      .children.includes(option.value) // Can't assign to current children
                }
              />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
      <ConfirmDialog
        title={'Update Notification Settings'}
        open={openNotificationsDialog}
        confirmButtonProps={{ loading: submitting }}
        onConfirm={async () => {
          const isValid = await notificationsFormMethods.trigger();

          if (isValid) {
            const { CC, To, SendEmail } = notificationsFormMethods.getValues();
            submit(+id, {
              Id: +id,
              CCEmail: CC.join(';'),
              Email: To.join(';'),
              SendEmail,
            }).then(() => {
              refreshData();
              setOpenNotificationsDialog(false);
            });
          }
        }}
        onCancel={async () => setOpenNotificationsDialog(false)}
      >
        <FormProvider {...notificationsFormMethods}>
          <Grid minWidth={'30rem'} mt={1} spacing={2} container>
            <Grid item xs={12}>
              <SingleSelectBoxFormField name={'SendEmail'} label={'Enable Email Notifications'} />
            </Grid>
            <Grid item xs={12}>
              <EmailChipFormField name={'To'} label={'To'} />
            </Grid>
            <Grid item xs={12}>
              <EmailChipFormField name={'CC'} label={'CC'} />
            </Grid>
          </Grid>
        </FormProvider>
      </ConfirmDialog>
    </Box>
  );
};

export default AgencyDetail;
