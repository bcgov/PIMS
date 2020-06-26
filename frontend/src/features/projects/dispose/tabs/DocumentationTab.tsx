import * as React from 'react';
import { Container } from 'react-bootstrap';
import {
  FirstNationsCheckListForm,
  DisposeWorkflowStatus,
  useStepper,
  DocumentationForm,
  AppraisalCheckListForm,
  ProjectNotes,
} from '..';
import _ from 'lodash';
import { PublicNotes, PrivateNotes } from '../components/ProjectNotes';

interface IDocumentationTabProps {
  isReadOnly?: boolean;
}

/**
 * Documentation tab used to display project details for the SPL or ERP processes.
 * @param param0 IDocumentationTabProps.
 */
const DocumentationTab: React.FunctionComponent<IDocumentationTabProps> = ({
  isReadOnly,
}: IDocumentationTabProps) => {
  const { project } = useStepper();
  const documentationTasks = _.filter(project.tasks, {
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  });

  return (
    <Container fluid>
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <AppraisalCheckListForm isReadOnly={isReadOnly} />
      <FirstNationsCheckListForm isReadOnly={isReadOnly} />
      <ProjectNotes disabled={true} />
      <PublicNotes disabled={isReadOnly} />
      <PrivateNotes disabled={isReadOnly} />
    </Container>
  );
};

export default DocumentationTab;
