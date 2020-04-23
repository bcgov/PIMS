import './Footer.scss';

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar expand className="footer">
      <Nav.Link href="http://www.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</Nav.Link>
      <Nav.Link href="http://www.gov.bc.ca/gov/content/home/privacy">Privacy</Nav.Link>
      <Nav.Link href="http://www.gov.bc.ca/gov/content/home/accessible-government">
        Accessibility
      </Nav.Link>
      <Nav.Link href="http://www.gov.bc.ca/gov/content/home/copyright">Copyright</Nav.Link>
    </Navbar>
  );
}

export default Footer;
