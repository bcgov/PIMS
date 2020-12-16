import * as React from 'react';
import { Container } from 'react-bootstrap';
import _ from 'lodash';
import {
  DocumentationForm,
  AppraisalCheckListForm,
  DisposeWorkflowStatus,
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

  return (
    <Container fluid>
      <DocumentationForm tasks={documentationTasks} isReadOnly={!canOverride} showNote={true} />
      <AppraisalCheckListForm isReadOnly={isReadOnly} taskStatusCode={appraisalTaskStatusCode} />
      <FirstNationsCheckListForm isReadOnly={isReadOnly} />
    </Container>
  );
};

export default DocumentationTab;
