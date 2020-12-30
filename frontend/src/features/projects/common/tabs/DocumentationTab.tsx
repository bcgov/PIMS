import * as React from 'react';
import { Container, Form } from 'react-bootstrap';
import _ from 'lodash';
import {
  DocumentationForm,
  AppraisalCheckListForm,
  DisposeWorkflowStatus,
  FirstNationsCheckListForm,
  useProject,
} from '../../common';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

interface IDocumentationTabProps {
  canOverride?: boolean;
  isReadOnly?: boolean;
  appraisalTaskStatusCode?: string;
}

/**
 * Documentation tab used to display project details for the SPL or ERP processes.
 * @param param0 IDocumentationTabProps.
 */
const DocumentationTab: React.FunctionComponent<IDocumentationTabProps> = ({
  canOverride,
  isReadOnly,
  appraisalTaskStatusCode,
}: IDocumentationTabProps) => {
  const { project } = useProject();
  const documentationTasks = _.filter(project.tasks, {
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  });
  const context = useFormikContext();

  return (
    <Container fluid>
      <DocumentationForm tasks={documentationTasks} isReadOnly={!canOverride} showNote={true} />
      <AppraisalCheckListForm isReadOnly={isReadOnly} taskStatusCode={appraisalTaskStatusCode} />

      <Form.Row>
        <Form.Label column md={2}>
          Appraised Value
        </Form.Label>
        <FastCurrencyInput field="appraised" formikProps={context} disabled={isReadOnly} md={2} />
      </Form.Row>
      <FirstNationsCheckListForm isReadOnly={isReadOnly} />
    </Container>
  );
};

export default DocumentationTab;
