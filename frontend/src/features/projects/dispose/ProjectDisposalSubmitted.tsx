import './ProjectDisposalSubmitted.scss';

import * as React from 'react';
import { Container } from 'react-bootstrap';
import { FaRegCheckCircle } from 'react-icons/fa';

/**
 * Display success message after all project disposal steps are completed successfully.
 */
export function ProjectDisposalSubmitted() {
  return (
    <Container className="ProjectDisposalSubmitted">
      <FaRegCheckCircle size={64} />
      <h5>Application Successfully Submitted</h5>
      <p>
        We have received your application to the Surplus Property Program to be added to the
        Enhanced Referral Program. Once your application is reviewed Strategic Real Estate Services
        will notify you of the results or request for more information. If any details of the
        application change please contact Strategic Real Estate Services directly at ???
      </p>
      <p>You may check the status of your application under "View Projects"</p>
    </Container>
  );
}

export default ProjectDisposalSubmitted;
