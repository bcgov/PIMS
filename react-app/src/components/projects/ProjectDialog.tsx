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

  const projectFormMethods = useForm({
    defaultValues: {
      StatusId: undefined,
      ProjectNumber: '',
      Name: '',
      TierLevelId: undefined,
      Description: '',
      Tasks: [],
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

  useEffect(() => {
    refreshTasks();
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

  return (
    <ConfirmDialog
      title={'Update Project'}
      open={open}
      onConfirm={async () => {
        const isValid = await projectFormMethods.trigger();
        if (!loadingTasks && isValid) {
          const values = projectFormMethods.getValues();
          api.projects
            .updateProject(+initialValues.Id, {
              ...values,
              Id: initialValues.Id,
              ProjectProperties: initialValues.ProjectProperties,
            })
            .then(() => postSubmit());
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
      onConfirm={async () => {
        const isValid = await financialFormMethods.trigger();
        if (isValid) {
          const { Assessed, NetBook, Market, Appraised, Metadata } =
            financialFormMethods.getValues();
          api.projects
            .updateProject(initialValues.Id, {
              Id: initialValues.Id,
              Assessed: Assessed,
              NetBook: NetBook,
              Market: Market,
              Appraised: Appraised,
              Metadata: Metadata,
              ProjectProperties: initialValues.ProjectProperties,
            })
            .then(() => postSubmit());
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
      onConfirm={async () => {
        api.projects
          .updateProject(
            initialValues.Id,
            { Id: initialValues.Id },
            {
              parcels: rows.filter((a) => a.Type == 'Parcel').map((a) => a.Id),
              buildings: rows.filter((a) => a.Type == 'Building').map((a) => a.Id),
            },
          )
          .then(() => postSubmit());
      }}
      onCancel={async () => onCancel()}
    >
      <Box minWidth={'500px'} paddingTop={'1rem'}>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
      </Box>
    </ConfirmDialog>
  );
};
