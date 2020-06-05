import './ProjectDisposalSubmitted.scss';

import * as React from 'react';
import { Container } from 'react-bootstrap';
import { FaRegCheckCircle } from 'react-icons/fa';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import styled from 'styled-components';

const ColoredWrapper = styled.div`
  color: #2e8540;
`;

/**
 * Display success message after all project disposal steps are completed successfully.
 */
export function ProjectDisposalSubmitted() {
  const keycloak = useKeycloakWrapper();
  return (
    <Container className="ProjectDisposalSubmitted">
      <ColoredWrapper>
        <h5>Thank you, {keycloak.displayName ?? 'Pims User'}</h5>
        <FaRegCheckCircle size={64} />
        <h5>Application Successfully Submitted</h5>
      </ColoredWrapper>
      <p>
        We have received your application to the Surplus Property Program to be added to the
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
}

export default ProjectDisposalSubmitted;
