import * as React from 'react';
import { Container } from 'react-bootstrap';
import { ProjectNotes, ProjectDraftForm, UpdateInfoForm, useProject } from '../../common';
import { PublicNotes, PrivateNotes } from '../../common/components/ProjectNotes';

interface IProjectInformationTabProps {
  isReadOnly?: boolean;
}

const ProjectInformationTab: React.FunctionComponent<IProjectInformationTabProps> = ({
  isReadOnly,
}: IProjectInformationTabProps) => {
  const { goToDisposePath } = useProject();
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
