import * as React from 'react';
import { Container } from 'react-bootstrap';
import { ProjectNotes, ProjectDraftForm, UpdateInfoForm, useProject } from '../../common';
import { PublicNotes, PrivateNotes } from '../../common';
import AdditionalPropertyInformationForm from '../../common/forms/AdditionalPropertyInformationForm';

interface ISurplusPropertyInformationTabProps {
  isReadOnly?: boolean;
}

const SurplusPropertyInformationTab: React.FunctionComponent<ISurplusPropertyInformationTabProps> = ({
  isReadOnly,
}: ISurplusPropertyInformationTabProps) => {
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
      <ProjectNotes disabled={true} label="Agency Notes" />
      <PublicNotes disabled={isReadOnly} />
      <PrivateNotes disabled={isReadOnly} />
      <ProjectNotes
        label="Reporting"
        field="reportingNote"
        disabled={isReadOnly}
        tooltip="Notes for Reporting"
      />
    </Container>
  );
};

export default SurplusPropertyInformationTab;
