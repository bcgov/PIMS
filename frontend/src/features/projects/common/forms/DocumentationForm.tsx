import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ProjectNotes } from '..';
import { IStepProps, IProjectTask } from '../interfaces';
import TasksForm from './TasksForm';
import variables from '_variables.module.scss';
import { ExemptionRequest } from 'features/projects/dispose';

interface IDocumentationFormProps extends IStepProps {
  tasks: IProjectTask[];
  showNote?: boolean;
}

const EmailText = styled.div`
  font: BCSans, Fallback, sans-serif;
  font-size: 14px;
  color: ${variables.textColor};
`;

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly, tasks, showNote = false }: IDocumentationFormProps) => {
  return (
    <Fragment>
      <h3>Documentation</h3>
      <TasksForm tasks={tasks ?? []} isReadOnly={isReadOnly} />
      <ExemptionRequest
        submissionStep={true}
        sectionHeader="Enhanced Referral Process Exemption"
        exemptionField="exemptionRequested"
        rationaleField="exemptionRationale"
        exemptionLabel="Apply for Enhanced Referral Process exemption"
        tooltip="Please see Process Manual for details."
        rationaleInstruction="Please provide your rationale below for exemption request"
        isReadOnly={isReadOnly}
      />
      {!isReadOnly && (
        <EmailText>
          Please send documents to{' '}
          <a href="mailto:RealPropertyDivision.Disposals@gov.bc.ca">
            RealPropertyDivision.Disposals@gov.bc.ca
          </a>
        </EmailText>
      )}
      {showNote && (
        <ProjectNotes
          label="Documentation Notes"
          field="documentationNote"
          className="col-md-auto"
        />
      )}
    </Fragment>
  );
};

export default DocumentationForm;
