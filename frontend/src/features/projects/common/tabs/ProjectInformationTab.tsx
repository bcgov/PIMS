import * as React from 'react';
import { Container } from 'react-bootstrap';

import {
  PrivateNotes,
  ProjectDraftForm,
  ProjectNotes,
  UpdateInfoForm,
  useProject,
} from '../../common';
import { PublicNotes } from '../components/ProjectNotes';
import AdditionalPropertyInformationForm from '../forms/AdditionalPropertyInformationForm';

interface IProjectInformationTabProps {
  isReadOnly?: boolean;
}

const ProjectInformationTab: React.FunctionComponent<IProjectInformationTabProps> = ({
  isReadOnly,
}: IProjectInformationTabProps) => {
  const { goToDisposePath } = useProject();
  return (
    <Container fluid>
      <ProjectDraftForm isReadOnly={isReadOnly} title="" />
      <AdditionalPropertyInformationForm isReadOnly={isReadOnly} />

      <UpdateInfoForm
        isReadOnly={isReadOnly}
        showRisk={true}
        goToAddProperties={() => goToDisposePath('assess/properties/update')}
        title="Property Information"
      />

      <h3>Notes</h3>
      <ProjectNotes className="col-md-auto" disabled={true} label="Notes" />
      <PrivateNotes className="col-md-auto" disabled={isReadOnly} />
      <PublicNotes />
      <ProjectNotes
        label="Reporting"
        tooltip="Notes for Reporting"
        field="reportingNote"
        className="col-md-auto"
        disabled={isReadOnly}
      />
    </Container>
  );
};

export default ProjectInformationTab;
