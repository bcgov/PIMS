import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect, useState } from 'react';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Project, ProjectGet } from '@/hooks/api/useProjectsApi';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ProjectDocumentationForm,
  ProjectFinancialInfoForm,
  ProjectGeneralInfoForm,
} from './ProjectForms';
import useDataLoader from '@/hooks/useDataLoader';
import DisposalProjectSearch from './DisposalPropertiesSearchTable';
import { Box, Typography } from '@mui/material';
import { ProjectTask } from '@/constants/projectTasks';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import AgencySearchTable from './AgencyResponseSearchTable';
import { ISelectMenuItem } from '../form/SelectFormField';
import { Agency } from '@/hooks/api/useAgencyApi';
import { AgencyResponseType } from '@/constants/agencyResponseTypes';
import { enumReverseLookup } from '@/utilities/helperFunctions';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import TextFormField from '../form/TextFormField';

interface IProjectGeneralInfoDialog {
  initialValues: Project;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectGeneralInfoDialog = (props: IProjectGeneralInfoDialog) => {
  const { open, postSubmit, onCancel, initialValues } = props;
  const api = usePimsApi();

  const {
    data: projectStatus,
    loadOnce: loadProjStatus,
    isLoading: loadingTasks,
  } = useDataLoader(api.lookup.getProjectStatuses);

  loadProjStatus();

  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);

  const projectFormMethods = useForm({
    defaultValues: {
      StatusId: undefined,
      ProjectNumber: '',
      Name: '',
      TierLevelId: undefined,
      Description: '',
      Tasks: [],
      Notes: [],
    },
    mode: 'all',
  });

  useEffect(() => {
    projectFormMethods.reset({
      StatusId: initialValues?.StatusId,
      ProjectNumber: initialValues?.ProjectNumber,
      Name: initialValues?.Name,
      TierLevelId: initialValues?.TierLevelId,
      Description: initialValues?.Description,
    });
  }, [initialValues]);

  const { data: tasks, refreshData: refreshTasks } = useDataLoader(() =>
    api.lookup.getTasks(projectFormMethods.getValues()['StatusId']),
  );

  const { data: noteTypes, refreshData: refreshNotes } = useDataLoader(() =>
    api.lookup.getProjectNoteTypes(projectFormMethods.getValues()['StatusId']),
  );

  useEffect(() => {
    refreshTasks();
    refreshNotes();
  }, [projectFormMethods.watch('StatusId')]); //When status id changes, fetch a new set of tasks possible for this status...

  useEffect(() => {
    //Subsequently, we need to default the values of the form either to the already present value in the Project data blob, or just set it to false.
    projectFormMethods.setValue(
      'Tasks',
      tasks?.map((task) => ({
        TaskId: task.Id,
        IsCompleted: initialValues?.Tasks?.find((a) => a.TaskId == task.Id)?.IsCompleted ?? false,
      })) ?? [],
    );
  }, [tasks, initialValues]);

  useEffect(() => {
    //Similarly for notes, we should set a blank value for any notes related to this status and scan for existing values to prepopulate.
    projectFormMethods.setValue(
      'Notes',
      noteTypes?.map((note) => ({
        NoteTypeId: note.Id,
        Note: initialValues?.Notes?.find((a) => a.NoteTypeId == note.Id)?.Note ?? '',
      })) ?? [],
    );
  }, [noteTypes, initialValues]);

  return (
    <ConfirmDialog
      title={'Update Project'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await projectFormMethods.trigger();
        if (!loadingTasks && isValid) {
          const values = projectFormMethods.getValues();
          submit(+initialValues.Id, {
            ...values,
            Id: initialValues.Id,
            ProjectProperties: initialValues.ProjectProperties,
          }).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...projectFormMethods}>
        <ProjectGeneralInfoForm
          projectStatuses={projectStatus?.map((st) => ({ value: st.Id, label: st.Name }))}
        />
        {initialValues &&
          initialValues?.StatusId !== projectFormMethods.getValues()['StatusId'] &&
          tasks?.length > 0 && (
            <Box mt={'1rem'}>
              <Typography variant="h5">Confirm Tasks</Typography>
              {tasks?.map((task, idx) => (
                <SingleSelectBoxFormField
                  key={`${task.Id}-${idx}`}
                  name={`Tasks.${idx}.IsCompleted`}
                  label={task.Name}
                />
              ))}
            </Box>
          )}
        {initialValues &&
          initialValues?.StatusId !== projectFormMethods.getValues()['StatusId'] &&
          noteTypes?.length > 0 && (
            <Box mt={'1rem'}>
              <Typography variant="h5" mb={'1rem'}>
                Confirm Notes
              </Typography>
              <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
                {noteTypes?.map((note, idx) => (
                  <TextFormField
                    minRows={2}
                    multiline
                    key={`${note.Id}-${idx}`}
                    name={`Notes.${idx}.Note`}
                    label={note.Description}
                  />
                ))}
              </Box>
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
  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);
  const financialFormMethods = useForm({
    defaultValues: {
      Assessed: 0,
      NetBook: 0,
      Market: 0,
      Appraised: 0,
      Metadata: {
        salesCost: 0,
        programCost: 0,
      },
    },
  });
  useEffect(() => {
    //console.log(`useEffect called! ${JSON.stringify(initialValues, null, 2)}`);
    financialFormMethods.reset({
      Assessed: +initialValues?.Assessed?.toString().replace(/[$,]/g, ''),
      NetBook: +initialValues?.NetBook?.toString().replace(/[$,]/g, ''),
      Market: +initialValues?.Market?.toString().replace(/[$,]/g, ''),
      Appraised: +initialValues?.Appraised?.toString().replace(/[$,]/g, ''),
      Metadata: initialValues?.Metadata,
    });
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Update Financial Information'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await financialFormMethods.trigger();
        if (isValid) {
          const { Assessed, NetBook, Market, Appraised, Metadata } =
            financialFormMethods.getValues();
          submit(initialValues.Id, {
            Id: initialValues.Id,
            Assessed: Assessed,
            NetBook: NetBook,
            Market: Market,
            Appraised: Appraised,
            Metadata: Metadata,
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
  agencies: Agency[];
  options: ISelectMenuItem[];
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectAgencyResponseDialog = (props: IProjectAgencyResponseDialog) => {
  const api = usePimsApi();
  const { initialValues, open, postSubmit, onCancel, options, agencies } = props;
  const { submit, submitting } = useDataSubmitter(api.projects.updateProject);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (initialValues && agencies) {
      setRows(
        initialValues.AgencyResponses?.map((resp) => ({
          ...agencies.find((agc) => agc.Id === resp.AgencyId),
          ReceivedOn: resp.ReceivedOn,
          Note: resp.Note,
          Response: enumReverseLookup(AgencyResponseType, resp.Response),
        })),
      );
    }
  }, [initialValues, agencies]);
  return (
    <ConfirmDialog
      dialogProps={{ maxWidth: 'lg' }}
      title={'Edit Agency Interest Responses'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        submit(initialValues.Id, {
          Id: initialValues.Id,
          ProjectProperties: initialValues.ProjectProperties,
          AgencyResponses: rows.map((agc) => ({
            AgencyId: agc.Id,
            OfferAmount: 0,
            Response: Number(AgencyResponseType[agc.Response]),
            ReceivedOn: agc.ReceivedOn,
            Note: agc.Note,
          })),
        }).then(() => postSubmit());
      }}
      onCancel={async () => onCancel()}
    >
      <Box paddingTop={'1rem'}>
        <AgencySearchTable agencies={agencies} options={options} rows={rows} setRows={setRows} />
      </Box>
    </ConfirmDialog>
  );
};
