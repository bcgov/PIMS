import usePimsApi from '@/hooks/usePimsApi';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Project, ProjectGet, ProjectMonetary, ProjectTimestamp } from '@/hooks/api/useProjectsApi';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ProjectDocumentationForm,
  ProjectFinancialInfoForm,
  ProjectGeneralInfoForm,
} from './ProjectForms';
import DisposalProjectSearch from './DisposalPropertiesSearchTable';
import { Box, Button, Grid, InputAdornment, Typography } from '@mui/material';
import { ProjectTask } from '@/constants/projectTasks';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import AgencySearchTable from './AgencyResponseSearchTable';
import { ISelectMenuItem } from '../form/SelectFormField';
import { Agency } from '@/hooks/api/useAgencyApi';
import { AgencyResponseType } from '@/constants/agencyResponseTypes';
import { enumReverseLookup } from '@/utilities/helperFunctions';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import TextFormField from '../form/TextFormField';
import { columnNameFormatter } from '@/utilities/formatters';
import DateFormField from '../form/DateFormField';
import dayjs from 'dayjs';
import { LookupContext } from '@/contexts/lookupContext';
import ProjectNotificationsTable from './ProjectNotificationsTable';
import { getStatusString } from '@/constants/chesNotificationStatus';
import { MonetaryType } from '@/constants/monetaryTypes';
import BaseDialog from '../dialog/BaseDialog';
import { NotificationQueue } from '@/hooks/api/useProjectNotificationApi';
import useAgencyOptions from '@/hooks/useAgencyOptions';

interface IProjectGeneralInfoDialog {
  initialValues: Project;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectGeneralInfoDialog = (props: IProjectGeneralInfoDialog) => {
  const { open, postSubmit, onCancel, initialValues } = props;
  const api = usePimsApi();
  const { data: lookupData, getLookupValueById } = useContext(LookupContext);
  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);
  const [approvedStatus, setApprovedStatus] = useState<number>(null);
  const projectFormMethods = useForm({
    defaultValues: {
      AgencyId: undefined,
      StatusId: undefined,
      ProjectNumber: '',
      Name: '',
      TierLevelId: undefined,
      Description: '',
      ConfirmNotifications: false,
      Tasks: [],
      Notes: [],
      Timestamps: [],
      Monetaries: [],
      ReportedFiscalYear: undefined,
      ActualFiscalYear: undefined,
      RiskId: undefined,
    },
  });

  useEffect(() => {
    projectFormMethods.reset({
      AgencyId: initialValues?.AgencyId,
      StatusId: initialValues?.StatusId,
      ProjectNumber: initialValues?.ProjectNumber,
      Name: initialValues?.Name,
      TierLevelId: initialValues?.TierLevelId,
      Description: initialValues?.Description,
      ConfirmNotifications: false,
      Tasks: [],
      Notes: [],
      Timestamps: [],
      Monetaries: [],
      ReportedFiscalYear: initialValues?.ReportedFiscalYear,
      ActualFiscalYear: initialValues?.ActualFiscalYear,
      RiskId: initialValues?.RiskId,
    });
  }, [initialValues]);
  const { agencyOptions } = useAgencyOptions();

  // When the agency is already disabled, it won't show up in the select options otherwise.
  // We add this to the options if it's not already there.
  const manipulatedAgencyOptions: ISelectMenuItem[] = useMemo(() => {
    const manipulatedAgencyOptions = [...agencyOptions];
    const startingAgency: Agency = getLookupValueById('Agencies', initialValues?.AgencyId);
    const parentAgency: Agency = getLookupValueById('Agencies', startingAgency?.ParentId);
    if (
      startingAgency &&
      (startingAgency.IsDisabled || parentAgency?.IsDisabled) &&
      !manipulatedAgencyOptions.find((a) => a.value === startingAgency.Id)
    ) {
      manipulatedAgencyOptions.push({
        label: startingAgency.Name,
        value: startingAgency.Id,
      });
    }
    // Don't sort these. Messes up the 2-tiered agency structure.
    return manipulatedAgencyOptions;
  }, [initialValues, agencyOptions]);

  const [statusTypes, setStatusTypes] = useState({
    Tasks: [],
    NoteTypes: [],
    MonetaryTypes: [],
    TimestampTypes: [],
  });
  useEffect(() => {
    const statusId = projectFormMethods.getValues()['StatusId'];
    if (statusId) {
      const NoteTypes = lookupData?.NoteTypes.filter((type) => type.StatusId === statusId);
      const Tasks = lookupData?.Tasks.filter((task) => task.StatusId === statusId);
      const MonetaryTypes = lookupData?.MonetaryTypes.filter((type) => type.StatusId === statusId);
      const TimestampTypes = lookupData?.TimestampTypes.filter(
        (type) => type.StatusId === statusId,
      );
      setStatusTypes({
        NoteTypes,
        Tasks,
        MonetaryTypes,
        TimestampTypes,
      });
    }
    projectFormMethods.clearErrors();
  }, [projectFormMethods.watch('StatusId'), lookupData]); //When status id changes, fetch a new set of tasks possible for this status...

  useEffect(() => {
    //Subsequently, we need to default the values of the form either to the already present value in the Project data blob, or just set it to false.
    projectFormMethods.setValue(
      'Tasks',
      statusTypes?.Tasks?.map((task) => ({
        TaskId: task.Id,
        IsCompleted: initialValues?.Tasks?.find((a) => a.TaskId == task.Id)?.IsCompleted ?? false,
      })) ?? [],
    );
  }, [statusTypes, initialValues]);

  useEffect(() => {
    //Similarly for notes, we should set a blank value for any notes related to this status and scan for existing values to prepopulate.
    projectFormMethods.setValue(
      'Notes',
      statusTypes.NoteTypes?.map((note) => ({
        NoteTypeId: note.Id,
        Note: initialValues?.Notes?.find((a) => a.NoteTypeId == note.Id)?.Note ?? '',
      })) ?? [],
    );
  }, [statusTypes, initialValues]);

  const getTimestampOrNull = (timestamps: ProjectTimestamp[], typeId: number) => {
    const found = timestamps?.find((d) => d.TimestampTypeId == typeId);
    if (found) {
      return dayjs(found.Date);
    } else {
      return null;
    }
  };
  useEffect(() => {
    projectFormMethods.setValue(
      'Timestamps',
      statusTypes.TimestampTypes?.map((ts) => ({
        TimestampTypeId: ts.Id,
        Date: getTimestampOrNull(initialValues?.Timestamps, ts.Id),
      })),
    );
  }, [statusTypes, initialValues]);

  const getMonetaryOrEmptyString = (monetaries: ProjectMonetary[], typeId: number) => {
    const found = monetaries?.find((m) => m.MonetaryTypeId == typeId);
    if (found) {
      return found.Value;
    } else {
      return '';
    }
  };
  useEffect(() => {
    projectFormMethods.setValue(
      'Monetaries',
      statusTypes.MonetaryTypes?.map((ts) => ({
        MonetaryTypeId: ts.Id,
        Value: getMonetaryOrEmptyString(initialValues?.Monetaries, ts.Id),
      })),
    );
  }, [statusTypes, initialValues]);

  useEffect(() => {
    setApprovedStatus(lookupData?.ProjectStatuses?.find((a) => a.Name === 'Approved for ERP')?.Id);
  }, [lookupData]);
  const status = projectFormMethods.watch('StatusId');
  const requireNotificationAcknowledge =
    approvedStatus == status && status !== initialValues?.StatusId;
  return (
    <ConfirmDialog
      title={'Update Project'}
      open={open}
      confirmButtonProps={{
        loading: submitting,
      }}
      onConfirm={async () => {
        const isValid = await projectFormMethods.trigger();
        if (lookupData && isValid) {
          const values = projectFormMethods.getValues();
          submit(+initialValues.Id, {
            ...values,
            Id: initialValues.Id,
            ProjectProperties: initialValues.ProjectProperties,
            Timestamps: values.Timestamps.filter((a) => dayjs(a.Date).isValid()),
          })
            .then(() => postSubmit())
            .catch((reason) => console.log(reason));
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...projectFormMethods}>
        <ProjectGeneralInfoForm
          projectStatuses={lookupData?.ProjectStatuses?.map((st) => ({
            value: st.Id,
            label: st.Name,
          }))}
          agencyOptions={manipulatedAgencyOptions ?? []}
        />
        {initialValues && statusTypes.Tasks?.length > 0 && (
          <Box mt={'1rem'}>
            <Typography variant="h5">Confirm Tasks</Typography>
            {statusTypes.Tasks?.map((task, idx) => (
              <SingleSelectBoxFormField
                key={`${task.Id}-${idx}`}
                name={`Tasks.${idx}.IsCompleted`}
                label={task.Name}
                required={!lookupData?.Tasks.find((t) => task.Id === t.Id)?.IsOptional}
              />
            ))}
          </Box>
        )}
        {initialValues && statusTypes.NoteTypes?.length > 0 && (
          <Box mt={'1rem'}>
            <Typography variant="h5" mb={'1rem'}>
              Confirm Notes
            </Typography>
            <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
              {statusTypes.NoteTypes?.map((note, idx) => (
                <TextFormField
                  minRows={2}
                  multiline
                  key={`${note.Id}-${idx}`}
                  name={`Notes.${idx}.Note`}
                  label={note.Description ?? columnNameFormatter(note.Name)}
                />
              ))}
            </Box>
          </Box>
        )}
        {initialValues && statusTypes.MonetaryTypes?.length > 0 && (
          <Box mt={'1rem'}>
            <Typography variant="h5" mb={'1rem'}>
              Confirm Monetary
            </Typography>
            <Grid container spacing={2}>
              {statusTypes.MonetaryTypes?.map((mon, idx) => (
                <Grid item xs={6} key={`mon-grid-${idx}`}>
                  <TextFormField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    defaultVal=""
                    numeric
                    key={`${mon.Id}-${idx}`}
                    name={`Monetaries.${idx}.Value`}
                    label={columnNameFormatter(mon.Name)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {initialValues && statusTypes.TimestampTypes?.length > 0 && (
          <Box mt={'1rem'}>
            <Typography variant="h5" mb={'1rem'}>
              Confirm Dates
            </Typography>
            <Grid container spacing={2}>
              {statusTypes.TimestampTypes?.map((ts, idx) => (
                <Grid key={`ts-grid-${idx}`} item xs={6}>
                  <DateFormField
                    key={`${ts.Id}-${idx}`}
                    name={`Timestamps.${idx}.Date`}
                    label={columnNameFormatter(ts.Name)}
                    required={
                      !lookupData?.TimestampTypes?.find((tt) => ts.Id === tt.Id)?.IsOptional
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {requireNotificationAcknowledge && (
          <Box sx={{ mt: '1rem' }}>
            <SingleSelectBoxFormField
              required={requireNotificationAcknowledge}
              name={'ConfirmNotifications'}
              label={'I acknowledge that notifications will be sent out when I submit this form.'}
            />
          </Box>
        )}
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IProjectFinancialDialog {
  initialValues: Project;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectFinancialDialog = (props: IProjectFinancialDialog) => {
  const api = usePimsApi();
  const { initialValues, open, postSubmit, onCancel } = props;
  const { data: lookupData } = useContext(LookupContext);
  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);
  const financialFormMethods = useForm({
    defaultValues: {
      Assessed: 0,
      NetBook: 0,
      Market: 0,
      Appraised: 0,
      SalesCost: 0,
      ProgramCost: 0,
    },
  });

  useEffect(() => {
    financialFormMethods.reset({
      Assessed: initialValues?.Assessed ?? 0,
      NetBook: initialValues?.NetBook ?? 0,
      Market: initialValues?.Market ?? 0,
      Appraised: initialValues?.Appraised ?? 0,
      SalesCost:
        initialValues?.Monetaries?.find((a) => a.MonetaryTypeId === MonetaryType.SALES_COST)
          ?.Value ?? 0,
      ProgramCost:
        initialValues?.Monetaries?.find((a) => a.MonetaryTypeId === MonetaryType.PROGRAM_COST)
          ?.Value ?? 0,
    });
  }, [initialValues, lookupData]);
  return (
    <ConfirmDialog
      title={'Update Financial Information'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await financialFormMethods.trigger();
        if (isValid) {
          const { Assessed, NetBook, Market, Appraised, ProgramCost, SalesCost } =
            financialFormMethods.getValues();
          submit(initialValues.Id, {
            Id: initialValues.Id,
            Assessed: Assessed,
            NetBook: NetBook,
            Market: Market,
            Appraised: Appraised,
            Monetaries: [
              {
                MonetaryTypeId: MonetaryType.SALES_COST,
                Value: SalesCost,
              },
              {
                MonetaryTypeId: MonetaryType.PROGRAM_COST,
                Value: ProgramCost,
              },
            ],
            ProjectProperties: initialValues.ProjectProperties,
          }).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...financialFormMethods}>
        <ProjectFinancialInfoForm />
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IProjectFinancialDialog {
  initialValues: Project;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectDocumentationDialog = (props: IProjectFinancialDialog) => {
  const { initialValues, open, onCancel } = props;
  const documentationFormMethods = useForm({
    defaultValues: {
      Tasks: {
        surplusDeclarationReadiness: false,
        tripleBottomLine: false,
      },
      Approval: false,
    },
  });
  useEffect(() => {
    documentationFormMethods.reset({
      Tasks: {
        surplusDeclarationReadiness: initialValues?.ProjectTasks?.find(
          (task) => task.TaskId === ProjectTask.SURPLUS_DECLARATION_READINESS,
        )?.IsCompleted,
        tripleBottomLine: initialValues?.ProjectTasks?.find(
          (task) => task.TaskId === ProjectTask.TRIPLE_BOTTOM_LINE,
        )?.IsCompleted,
      },
      Approval: initialValues?.ApprovedOn ? true : false,
    });
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Update Documentation'}
      open={open}
      confirmButtonProps={{ disabled: true }}
      onConfirm={async () => {}}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...documentationFormMethods}>
        <ProjectDocumentationForm />
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IProjectPropertiesDialog {
  initialValues: ProjectGet;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectPropertiesDialog = (props: IProjectPropertiesDialog) => {
  const api = usePimsApi();
  const { initialValues, open, postSubmit, onCancel } = props;
  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows([
      ...(initialValues?.Parcels?.map((p) => ({ ...p, Type: 'Parcel' })) ?? []),
      ...(initialValues?.Buildings?.map((b) => ({ ...b, Type: 'Building' })) ?? []),
    ]);
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Edit Properties List'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      dialogProps={{ maxWidth: 'lg' }}
      onConfirm={async () => {
        submit(
          initialValues.Id,
          { Id: initialValues.Id },
          {
            parcels: rows.filter((a) => a.Type == 'Parcel').map((a) => a.Id),
            buildings: rows.filter((a) => a.Type == 'Building').map((a) => a.Id),
          },
        ).then(() => postSubmit());
      }}
      onCancel={async () => onCancel()}
    >
      <Box minWidth={'700px'} paddingTop={'1rem'}>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
      </Box>
    </ConfirmDialog>
  );
};

interface IProjectAgencyResponseDialog {
  initialValues: ProjectGet;
  open: boolean;
  options: ISelectMenuItem[];
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectAgencyResponseDialog = (props: IProjectAgencyResponseDialog) => {
  const api = usePimsApi();
  const { data: lookupData } = useContext(LookupContext);
  const { activeAgencies } = useAgencyOptions();
  const { initialValues, open, postSubmit, onCancel, options } = props;
  const { submit, submitting } = useDataSubmitter(api.projects.updateProjectWatch);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (initialValues && lookupData?.Agencies) {
      setRows(
        initialValues.AgencyResponses?.map((resp) => ({
          ...lookupData?.Agencies.find((agc) => agc.Id === resp.AgencyId),
          ReceivedOn: resp.ReceivedOn,
          Note: resp.Note,
          Response: enumReverseLookup(AgencyResponseType, resp.Response),
        })),
      );
    }
  }, [initialValues, lookupData?.Agencies]);
  return (
    <ConfirmDialog
      dialogProps={{ maxWidth: 'lg' }}
      title={'Edit Agency Interest Responses'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        submit(
          initialValues.Id,
          rows.map((agc) => ({
            AgencyId: agc.Id,
            OfferAmount: 0,
            Response: Number(AgencyResponseType[agc.Response]),
            Note: agc.Note,
            ProjectId: initialValues.Id,
          })),
        ).then(() => postSubmit());
      }}
      onCancel={async () => onCancel()}
    >
      <Box paddingTop={'1rem'}>
        <AgencySearchTable
          agencies={activeAgencies as Agency[]}
          options={options}
          rows={rows}
          setRows={setRows}
        />
      </Box>
    </ConfirmDialog>
  );
};

interface INotificationDialog {
  initialValues: NotificationQueue[];
  open: boolean;
  ungroupedAgencies: Partial<Agency>[];
  onRowResendClick: (id: number) => void;
  onRowCancelClick: (id: number) => void;
  onCancel: () => void;
}

export const ProjectNotificationDialog = (props: INotificationDialog) => {
  const { initialValues, open, onCancel } = props;
  const lookup = useContext(LookupContext);
  const [rows, setRows] = useState<NotificationQueue[]>([]);
  useEffect(() => {
    if (initialValues) {
      setRows(
        initialValues.map((notif) => ({
          AgencyName: lookup.getLookupValueById('Agencies', notif.ToAgencyId)?.Name,
          ChesStatusName: getStatusString(notif.Status),
          ...notif,
        })),
      );
    }
  }, [initialValues]);

  return (
    <BaseDialog
      dialogProps={{ maxWidth: 'xl', fullWidth: true }}
      title={'Update Project Notifications'}
      open={open}
      actions={
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Close
        </Button>
      }
    >
      <Box paddingTop={'1rem'}>
        <ProjectNotificationsTable
          onCancelClick={props.onRowCancelClick}
          onResendClick={props.onRowResendClick}
          rows={rows}
        />
      </Box>
    </BaseDialog>
  );
};
