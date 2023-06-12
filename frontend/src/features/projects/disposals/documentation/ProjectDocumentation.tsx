import { Check, FastCurrencyInput, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { DisposeWorkflowStatus } from 'hooks/api/projects';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

export const ProjectDocumentation: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();
  const { setFieldValue } = formik;

  // Disabled prop
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;
  const keycloak = useKeycloakWrapper();
  const [disabled, setDisabled] = useState(false);
  const isAdmin = keycloak.hasClaim(Claim.ReportsSplAdmin);

  const projectTasks = formik.values.tasks
    .filter((t) => t.statusCode === DisposeWorkflowStatus.RequiredDocumentation)
    .map((t, i) => (
      <Check
        key={i}
        field={`tasks.${formik.values.tasks.findIndex((ft) => ft.taskId === t.taskId)}.isCompleted`}
        postLabel={t.description}
        required={!t.isOptional}
        disabled={disabled}
      />
    ));
  const firstNationTasks = formik.values.tasks
    .filter((t) => t.statusCode === ReviewWorkflowStatus.FirstNationConsultation)
    .map((t, i) => (
      <Check
        key={i}
        field={`tasks.${formik.values.tasks.findIndex((ft) => ft.taskId === t.taskId)}.isCompleted`}
        postLabel={t.description}
        required={!t.isOptional}
        disabled={disabled}
      />
    ));
  const appraisalTasks = formik.values.tasks
    .filter((t) => t.statusCode === ReviewWorkflowStatus.AppraisalReview)
    .map((t, i) => (
      <Check
        key={i}
        field={`tasks.${formik.values.tasks.findIndex((ft) => ft.taskId === t.taskId)}.isCompleted`}
        postLabel={t.description}
        required={!t.isOptional}
        disabled={disabled}
        onChange={(checked) => {
          // There are essentially duplicate tasks in the disposal process that match the appraisal tasks.
          // We need to copy the value over.
          const appraisalName = formik.values.tasks.find((ft) => ft.taskId === t.taskId)?.name;
          const field = `tasks.${formik.values.tasks.findIndex(
            (t) =>
              t.statusCode === ReviewWorkflowStatus.DisposalProcess && t.name === appraisalName,
          )}.isCompleted`;
          setFieldValue(field, checked);
        }}
      />
    ));

  useEffect(() => {
    setDisabled(
      [
        WorkflowStatus.Disposed,
        WorkflowStatus.Cancelled,
        WorkflowStatus.TransferredGRE,
        WorkflowStatus.Denied,
      ].includes(statusCode) && !isAdmin,
    );
  }, [isAdmin, workflowCode, statusCode]);

  return (
    <styled.ProjectDocumentation nowrap>
      <Col grow={1}>
        <Col className="form-section">{projectTasks}</Col>
        <Col className="form-section">
          <h2>First Nation Consultation</h2>
          {firstNationTasks}
        </Col>
        <Col className="form-section">
          <h2>Appraisal</h2>
          {appraisalTasks}
          <FastCurrencyInput
            label="Appraisal Value"
            field="appraised"
            formikProps={formik}
            disabled={disabled}
          />
          <TextArea label="Appraisal Note" field="appraisedNote" disabled={disabled} />
        </Col>
      </Col>
      <Col className="form-section" grow={2}>
        <h2>Notes</h2>
        <Row grow={0}>
          <Col>
            <TextArea label="Agency Notes" field="note" disabled />
          </Col>
          <Col>
            <TextArea label="Reporting" field="reportingNote" disabled={disabled} />
          </Col>
          <Col>
            <TextArea
              data-testid="proj-doc-notes-shared-textarea"
              label="Shared Notes"
              field="publicNote"
              disabled={disabled}
            />
          </Col>
          <Col>
            <TextArea
              data-testid="proj-doc-notes-private-textarea"
              label="Private Notes"
              field="privateNote"
              disabled={disabled}
            />
          </Col>
        </Row>
      </Col>
    </styled.ProjectDocumentation>
  );
};
