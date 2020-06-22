import * as React from 'react';
import { Container } from 'react-bootstrap';
import { useStepper, ProjectNotes, ProjectDraftForm, UpdateInfoForm } from '..';

interface IProjectInformationTabProps {
  isReadOnly?: boolean;
}

const ProjectInformationTab: React.FunctionComponent<IProjectInformationTabProps> = ({
  isReadOnly,
}: IProjectInformationTabProps) => {
  const { goToDisposePath } = useStepper();
  return (
    <Container>
      <ProjectDraftForm isReadOnly={isReadOnly} title="Project Property Information" />
      <UpdateInfoForm
        isReadOnly={isReadOnly}
        goToAddProperties={() => goToDisposePath('assess/properties/update')}
        title=""
      />
      <ProjectNotes disabled={isReadOnly} />
      <ProjectNotes
        disabled={isReadOnly}
        tooltip="Visible to SRES only"
        label="Private Notes"
        field="privateNote"
      />
    </Container>
  );
};

export default ProjectInformationTab;
