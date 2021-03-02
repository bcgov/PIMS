import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik, setIn, yupToFormErrors } from 'formik';
import { Form } from 'components/common/form';
import { IStepProps, IProjectTask, IProject, DisposeWorkflowStatus } from '../../common/interfaces';
import { useStepper, EnhancedReferralExemptionSchema } from '..';
import _ from 'lodash';
import { useStepForm, DocumentationForm, ProjectNotes, StepErrorSummary } from '../../common';

const handleValidate = (project: IProject) => {
  return project.tasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (
      !task.isCompleted &&
      !task.isOptional &&
      task.statusCode === DisposeWorkflowStatus.RequiredDocumentation
    ) {
      errors = setIn(errors, `tasks.${index}.isCompleted`, 'Required');
    }
    try {
      EnhancedReferralExemptionSchema.validateSync(project, {
        abortEarly: false,
      });
    } catch (schemaErrors) {
      return _.merge(errors, yupToFormErrors(schemaErrors));
    }

    return errors;
  }, {});
};

/**
 * Displays all tasks from TASK table as clickable checkboxes.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const DocumentationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit, canUserEditForm } = useStepForm();
  const { project } = useStepper();
  const tasks = _.filter(project.tasks, {
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  });
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Container fluid className="DocumentationStep">
      <Formik
        initialValues={project}
        innerRef={formikRef}
        validate={handleValidate}
        validateOnChange={false}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          // set the completed on dates during submission.
          values.tasks.forEach((task: any, index: any) => {
            const existingTask = project.tasks[index];

            //if any tasks have been completed for the first time set the completed date.
            if (task.isCompleted && !existingTask.isCompleted) {
              task.completedOn = new Date();
            }
          });
          return onSubmit(values, actions);
        }}
      >
        {() => (
          <Form>
            <DocumentationForm
              isReadOnly={isReadOnly || !canUserEditForm(project.agencyId)}
              tasks={tasks}
            />
            {!isReadOnly && <ProjectNotes className="col-md-auto" />}
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default DocumentationStep;
