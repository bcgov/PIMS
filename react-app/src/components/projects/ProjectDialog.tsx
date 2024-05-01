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
import { Box } from '@mui/material';

interface IProjectGeneralInfoDialog {
  initialValues: Project;
  open: boolean;
  postSubmit: () => void;
  onCancel: () => void;
}

export const ProjectGeneralInfoDialog = (props: IProjectGeneralInfoDialog) => {
  const { open, postSubmit, onCancel, initialValues } = props;
  const api = usePimsApi();
  const { data: projectStatus, loadOnce: loadProjStatus } = useDataLoader(
    api.lookup.getProjectStatuses,
  );
  loadProjStatus();
  const projectFormMethods = useForm({
    defaultValues: {
      StatusId: undefined,
      ProjectNumber: '',
      Name: '',
      TierLevelId: undefined,
      Description: '',
    },
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
  return (
    <ConfirmDialog
      title={'Update Project'}
      open={open}
      onConfirm={async () => {
        const isValid = await projectFormMethods.trigger();
        if (isValid) {
          const values = projectFormMethods.getValues();
          api.projects
            .updateProject(+initialValues.Id, {
              StatusId: values.StatusId,
              Name: values.Name,
              TierLevelId: values.TierLevelId,
              Description: values.Description,
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
      Assessed: initialValues?.Assessed,
      NetBook: initialValues?.NetBook,
      Market: initialValues?.Market,
      Appraised: initialValues?.Appraised,
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
              Assessed: Assessed,
              NetBook: NetBook,
              Market: Market,
              Appraised: Appraised,
              Metadata: Metadata,
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
  const { initialValues, open, postSubmit, onCancel } = props;
  const api = usePimsApi();
  const documentationFormMethods = useForm({
    defaultValues: {
      ProjectTasks: [],
    },
  });
  useEffect(() => {
    documentationFormMethods.reset({
      ProjectTasks: initialValues?.ProjectTasks,
    });
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Update Documentation'}
      open={open}
      onConfirm={async () => {
        const isValid = await documentationFormMethods.trigger();
        if (isValid) {
          //const { SurplusDeclaration, TripleBottom } = documentationFormMethods.getValues();
          api.projects
            .updateProject(initialValues.Id, {
              // Tasks: {
              //   surplusDeclarationReadiness: SurplusDeclaration,
              //   tripleBottomLine: TripleBottom,
              // },
            })
            .then(() => postSubmit());
        }
      }}
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
        api.projects.updateProject(initialValues.Id, {}).then(() => postSubmit());
      }}
      onCancel={async () => onCancel()}
    >
      <Box minWidth={'500px'} paddingTop={'1rem'}>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
      </Box>
    </ConfirmDialog>
  );
};
