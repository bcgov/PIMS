import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect } from 'react';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Project } from '@/hooks/api/useProjectsApi';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ProjectDocumentationForm,
  ProjectFinancialInfoForm,
  ProjectGeneralInfoForm,
} from './ProjectForms';
import useDataLoader from '@/hooks/useDataLoader';

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
      Id: '',
      Name: '',
      TierLevelId: undefined,
      Description: '',
    },
  });
  useEffect(() => {
    projectFormMethods.reset({
      StatusId: initialValues?.StatusId,
      Id: String(initialValues?.Id),
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
      AssessedValue: 0,
      NetBookValue: 0,
      EstimatedMarketValue: 0,
      AppraisedValue: 0,
      Metadata: {
        salesCost: 0,
        programCost: 0,
      },
    },
  });
  useEffect(() => {
    //console.log(`useEffect called! ${JSON.stringify(initialValues, null, 2)}`);
    financialFormMethods.reset({
      AssessedValue: initialValues?.Assessed,
      NetBookValue: initialValues?.NetBook,
      EstimatedMarketValue: initialValues?.Market,
      AppraisedValue: initialValues?.Appraised,
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
          const { AssessedValue, NetBookValue, EstimatedMarketValue, AppraisedValue, Metadata } =
            financialFormMethods.getValues();
          api.projects
            .updateProject(initialValues.Id, {
              Assessed: AssessedValue,
              NetBook: NetBookValue,
              Market: EstimatedMarketValue,
              Appraised: AppraisedValue,
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
