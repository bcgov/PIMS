import * as React from 'react';
import { Container } from 'react-bootstrap';
import { useStepper, ProjectNotes, ProjectDraftForm, UpdateInfoForm } from '..';
import { PublicNotes, PrivateNotes } from '../components/ProjectNotes';

interface IProjectInformationTabProps {
  isReadOnly?: boolean;
}

const ProjectInformationTab: React.FunctionComponent<IProjectInformationTabProps> = ({
  isReadOnly,
}: IProjectInformationTabProps) => {
  const { goToDisposePath } = useStepper();
  return (
    <Container fluid>
      <ProjectDraftForm isReadOnly={isReadOnly} title="Project Property Information" />
      <UpdateInfoForm
        isReadOnly={isReadOnly}
        goToAddProperties={() => goToDisposePath('assess/properties/update')}
        title=""
      />
      <ProjectNotes disabled={true} />
      <PublicNotes disabled={isReadOnly} />
      <PrivateNotes disabled={isReadOnly} />
    </Container>
  );
};

export default ProjectInformationTab;
