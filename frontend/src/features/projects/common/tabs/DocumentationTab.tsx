import * as React from 'react';
import { Container } from 'react-bootstrap';
import _ from 'lodash';
import { PublicNotes, PrivateNotes } from '../../common/components/ProjectNotes';
import {
  DocumentationForm,
  AppraisalCheckListForm,
  ProjectNotes,
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
      <DocumentationForm tasks={documentationTasks} isReadOnly={!canOverride} />
      <AppraisalCheckListForm isReadOnly={isReadOnly} taskStatusCode={appraisalTaskStatusCode} />
      <FirstNationsCheckListForm isReadOnly={isReadOnly} />
      <ProjectNotes disabled={true} />
      <PublicNotes disabled={isReadOnly} />
      <PrivateNotes disabled={isReadOnly} />
    </Container>
  );
};

export default DocumentationTab;
