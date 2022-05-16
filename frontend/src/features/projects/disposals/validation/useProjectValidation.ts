import * as Yup from 'yup';
import { FormikErrors, setIn } from 'formik';
import { useHistory } from 'react-router-dom';
import {
  documentationSchema,
  informationProjectSchema,
  informationPropertiesSchema,
  erpExemptionSchema,
  erpCompleteSchema,
  erpDisposedSchema,
  splApprovalSchema,
  splContractInPlaceSchema,
} from '.';
import { IProjectForm } from '../interfaces';
import { notSplSchema } from './notSplSchema';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { splMarketingSchema } from './splMarketingSchema';
import { splTransferWithinGRESchema } from './splTransferWithinGRESchema';

interface IProjectValidationProps {
  id: number;
}

/**
 * Validate the project.
 * Redirect users to the correct tab.
 * @param param0 Hook properties
 * @returns Formik errors.
 */
export const useProjectValidation = ({ id }: IProjectValidationProps) => {
  const history = useHistory();

  return async (values: IProjectForm): Promise<FormikErrors<IProjectForm>> => {
    let errors: FormikErrors<IProjectForm> = {};
    let hasErrors = false;
    const { workflowCode, statusCode, originalWorkflowCode, originalStatusCode } = values;

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, informationProjectSchema, () => {
        history.push(`/projects/disposal/${id}/information`);
        hasErrors = true;
      })),
    };
    if (hasErrors) return errors;

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, informationPropertiesSchema, () => {
        history.push(`/projects/disposal/${id}/information/properties`);
        hasErrors = true;
      })),
    };
    if (hasErrors) return errors;

    try {
      if (!values.tasks[0].isCompleted) {
        errors = {
          ...errors,
          ...setIn(
            errors,
            'tasks[0].isCompleted',
            'Surplus Declaration & Readiness Checklist document required',
          ),
        };
        hasErrors = true;
      }
      if (!values.tasks[1].isCompleted) {
        errors = {
          ...errors,
          ...setIn(
            errors,
            'tasks[1].isCompleted',
            'Triple Bottom Line document emailed to SRES required',
          ),
        };
        hasErrors = true;
      }
      // When disposing an appraisal is required.
      if (
        values.statusCode === WorkflowStatus.Disposed &&
        values.originalStatusCode !== WorkflowStatus.NotInSpl
      ) {
        const tasks = values.tasks.filter(
          t => t.statusCode === WorkflowStatus.Disposed && !t.isOptional && !t.isCompleted,
        );
        tasks.forEach(t => {
          const index = values.tasks.findIndex(ti => ti.name === t.name);
          errors = {
            ...errors,
            ...setIn(errors, `tasks.${index}.isCompleted`, `${t.name} required`),
          };
        });
        if (tasks.length) hasErrors = true;
      }

      await documentationSchema.validate(values, { abortEarly: false });
      if (hasErrors) {
        history.push(`/projects/disposal/${id}/documentation`);
        return errors;
      }
    } catch (err) {
      errors = {
        ...errors,
        ...(err as any).inner.reduce((formError: any, innerError: any) => {
          return setIn(formError, innerError.path, innerError.message);
        }, {}),
      };

      history.push(`/projects/disposal/${id}/documentation`);
      return errors;
    }

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, erpExemptionSchema, () => {
        history.push(`/projects/disposal/${id}/erp/exemption`);
        hasErrors = true;
      })),
    };

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, erpCompleteSchema, () => {
        history.push(`/projects/disposal/${id}/erp/complete`);
        hasErrors = true;
      })),
    };
    if (hasErrors) return errors;

    if (
      (workflowCode === Workflow.ERP ||
        workflowCode === Workflow.ASSESS_EXEMPTION ||
        workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
      originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, erpDisposedSchema, () => {
          history.push(`/projects/disposal/${id}/erp/disposed`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;
    }

    if (
      originalStatusCode === WorkflowStatus.NotInSpl &&
      (statusCode === WorkflowStatus.Disposed || statusCode === WorkflowStatus.TransferredGRE)
    ) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, notSplSchema, () => {
          history.push(`/projects/disposal/${id}/not/spl`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;
    }

    if (originalWorkflowCode === Workflow.SPL) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splApprovalSchema, () => {
          history.push(`/projects/disposal/${id}/spl`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splMarketingSchema, () => {
          history.push(`/projects/disposal/${id}/spl/marketing`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splContractInPlaceSchema, () => {
          history.push(`/projects/disposal/${id}/spl/contract/in/place`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splTransferWithinGRESchema, () => {
          history.push(`/projects/disposal/${id}/spl/transfer/within/gre`);
          hasErrors = true;
        })),
      };
      if (hasErrors) return errors;
    }

    return errors;
  };
};

const handleErrors = async (
  values: IProjectForm,
  errors: FormikErrors<IProjectForm>,
  schema: Yup.ObjectSchema,
  redirect: () => void,
) => {
  try {
    await schema.validate(values, { abortEarly: false });
  } catch (err) {
    errors = {
      ...errors,
      ...applyErrors(err),
    };

    if (typeof redirect === 'function') redirect();
    return errors;
  }

  return errors;
};

const applyErrors = (exception: any) => {
  return exception.inner.reduce((formError: any, innerError: any) => {
    return setIn(formError, innerError.path, innerError.message);
  }, {});
};
