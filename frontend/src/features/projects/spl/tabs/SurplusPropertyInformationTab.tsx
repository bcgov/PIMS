import * as React from 'react';
import { Container } from 'react-bootstrap';
import { ProjectNotes, ProjectDraftForm, UpdateInfoForm, useProject } from '../../common';
import { PublicNotes, PrivateNotes } from '../../common';
import { SurplusPropertyListApprovalForm } from '..';
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
      <SurplusPropertyListApprovalForm isReadOnly={isReadOnly} />
      <h3>Project Property Information</h3>
      <AdditionalPropertyInformationForm isReadOnly={isReadOnly} />
      <ProjectDraftForm isReadOnly={isReadOnly} title="" />
      <UpdateInfoForm
        isReadOnly={isReadOnly}
        goToAddProperties={() => goToDisposePath('assess/properties/update')}
        title=""
      />
      <ProjectNotes disabled={true} />
      <ProjectNotes field="appraisedNote" label="Appraised Notes" disabled={isReadOnly} />
      <PublicNotes disabled={isReadOnly} />
      <PrivateNotes disabled={isReadOnly} />
    </Container>
  );
};

export default SurplusPropertyInformationTab;
