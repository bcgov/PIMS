import { FormikErrors, setIn } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { useNavigate } from 'react-router-dom';

import { IProjectForm } from '../interfaces';
import {
  documentationSchema,
  erpCompleteSchema,
  erpDisposedSchema,
  erpExemptionSchema,
  informationProjectSchema,
  informationPropertiesSchema,
  splApprovalSchema,
  splContractInPlaceSchema,
} from '.';
import { notSplSchema } from './notSplSchema';
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
  const navigate = useNavigate();

  return async (values: IProjectForm): Promise<FormikErrors<IProjectForm>> => {
    let errors: FormikErrors<IProjectForm> = {};
    const { workflowCode, statusCode, originalWorkflowCode, originalStatusCode } = values;

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, informationProjectSchema, () => {
        navigate(`/projects/disposal/${id}/information`);
      })),
    };
    if (Object.keys(errors).length > 0) return errors;

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, informationPropertiesSchema, () => {
        navigate(`/projects/disposal/${id}/information/properties`);
      })),
    };
    if (Object.keys(errors).length > 0) return errors;

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
      }
      // When disposing an appraisal is required.
      if (
        values.statusCode === WorkflowStatus.Disposed &&
        values.originalStatusCode !== WorkflowStatus.NotInSpl
      ) {
        const tasks = values.tasks.filter(
          (t) => t.statusCode === WorkflowStatus.Disposed && !t.isOptional && !t.isCompleted,
        );
        tasks.forEach((t) => {
          const index = values.tasks.findIndex((ti) => ti.name === t.name);
          errors = {
            ...errors,
            ...setIn(errors, `tasks.${index}.isCompleted`, `${t.name} required`),
          };
        });
      }

      documentationSchema.parse(values);
      if (Object.keys(errors).length > 0) {
        navigate(`/projects/disposal/${id}/documentation`);
        return errors;
      }
    } catch (err) {
      errors = {
        ...errors,
        ...(err as any).inner?.reduce((formError: any, innerError: any) => {
          return setIn(formError, innerError.path, innerError.message);
        }, {}),
      };

      navigate(`/projects/disposal/${id}/documentation`);
      return errors;
    }

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, erpExemptionSchema, () => {
        navigate(`/projects/disposal/${id}/erp/exemption`);
      })),
    };

    errors = {
      ...errors,
      ...(await handleErrors(values, errors, erpCompleteSchema, () => {
        navigate(`/projects/disposal/${id}/erp/complete`);
      })),
    };
    if (Object.keys(errors).length > 0) return errors;

    if (
      (workflowCode === Workflow.ERP ||
        workflowCode === Workflow.ASSESS_EXEMPTION ||
        workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
      originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, erpDisposedSchema, () => {
          navigate(`/projects/disposal/${id}/erp/disposed`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;
    }

    if (
      originalStatusCode === WorkflowStatus.NotInSpl &&
      (statusCode === WorkflowStatus.Disposed || statusCode === WorkflowStatus.TransferredGRE)
    ) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, notSplSchema, () => {
          navigate(`/projects/disposal/${id}/not/spl`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;
    }

    if (originalWorkflowCode === Workflow.SPL) {
      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splApprovalSchema, () => {
          navigate(`/projects/disposal/${id}/spl`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splMarketingSchema, () => {
          navigate(`/projects/disposal/${id}/spl/marketing`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splContractInPlaceSchema, () => {
          navigate(`/projects/disposal/${id}/spl/contract/in/place`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;

      errors = {
        ...errors,
        ...(await handleErrors(values, errors, splTransferWithinGRESchema, () => {
          navigate(`/projects/disposal/${id}/spl/transfer/within/gre`);
        })),
      };
      if (Object.keys(errors).length > 0) return errors;
    }
    return errors;
  };
};

const handleErrors = async (
  values: IProjectForm,
  errors: FormikErrors<IProjectForm>,
  schema: any,
  redirect: () => void,
) => {
  try {
    schema.parse(values);
  } catch (err) {
    errors = {
      ...errors,
      ...applyErrors(err),
    };

    if (typeof redirect === 'function') redirect();
  }
  return errors;
};

const applyErrors = (exception: any) => {
  if (!exception.errors) {
    return {};
  }

  return exception.errors?.reduce((formError: any, error: any) => {
    return setIn(formError, error.path.join('.'), error.message);
  }, {});
};
