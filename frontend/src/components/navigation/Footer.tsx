import './Footer.scss';
import React from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar className="footer" fixed="bottom">
      <Container fluid={true}>
        <Row className="content">
          <Col xs="auto" md={2} />
          <Col className="navs" md={10}>
            <Nav.Link href="http://www.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</Nav.Link>
            <Nav.Link href="http://www.gov.bc.ca/gov/content/home/privacy">Privacy</Nav.Link>
            <Nav.Link href="http://www.gov.bc.ca/gov/content/home/accessible-government">
              Accessibility
            </Nav.Link>
            <Nav.Link href="http://www.gov.bc.ca/gov/content/home/copyright">Copyright</Nav.Link>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Footer;
