import * as React from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import { PrivateNotes, ProjectDraftForm, ProjectNotes, UpdateInfoForm } from '../../common';
import { PublicNotes } from '../components/ProjectNotes';
import AdditionalPropertyInformationForm from '../forms/AdditionalPropertyInformationForm';

interface IProjectInformationTabProps {
  isReadOnly?: boolean;
}

const ProjectInformationTab: React.FunctionComponent<IProjectInformationTabProps> = ({
  isReadOnly,
}: IProjectInformationTabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Container fluid>
      <ProjectDraftForm isReadOnly={isReadOnly} title="" />
      <AdditionalPropertyInformationForm isReadOnly={isReadOnly} />

      <UpdateInfoForm
        isReadOnly={isReadOnly}
        showRisk={true}
        goToAddProperties={() => navigate(`/projects/assess/properties/update${location.search}`)}
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
