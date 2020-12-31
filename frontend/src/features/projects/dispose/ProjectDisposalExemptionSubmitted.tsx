import './ProjectDisposalSubmitted.scss';

import * as React from 'react';
import { Container } from 'react-bootstrap';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import StepStatusIcon from '../common/components/StepStatusIcon';

/**
 * Display success message after all project disposal steps are completed successfully.
 */
export const ProjectDisposalExemptionSubmitted = () => {
  const keycloak = useKeycloakWrapper();
  return (
    <Container className="ProjectDisposalSubmitted">
      <StepStatusIcon
        preIconLabel={`Thank you, ${keycloak.displayName ?? 'Pims User'}`}
        postIconLabel={'Application Successfully Submitted'}
      />
      <p>
        We have received your application to the Surplus Property Program to be exempted from the
        Enhanced Referral Program. Once your application is reviewed Strategic Real Estate Services
        will notify you of the results or request for more information. If any details of the
        application change please contact Strategic Real Estate Services directly at&nbsp;
        <a href="mailto:RealPropertyDivision.Disposals@gov.bc.ca">
          RealPropertyDivision.Disposals@gov.bc.ca
        </a>
      </p>
      <p>You may check the status of your application under "View Projects"</p>
    </Container>
  );
};
