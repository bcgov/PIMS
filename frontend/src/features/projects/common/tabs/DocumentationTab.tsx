import { FastCurrencyInput } from 'components/common/form';
import { DisposeWorkflowStatus } from 'features/projects/constants';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import { Container, Form } from 'react-bootstrap';

import {
  AppraisalCheckListForm,
  DocumentationForm,
  FirstNationsCheckListForm,
  useProject,
} from '../../common';

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

      <Form.Group>
        <Form.Label column md={2}>
          Appraised Value
        </Form.Label>
        <FastCurrencyInput field="appraised" formikProps={context} disabled={isReadOnly} md={2} />
      </Form.Group>
      <FirstNationsCheckListForm isReadOnly={isReadOnly} />
    </Container>
  );
};

export default DocumentationTab;
