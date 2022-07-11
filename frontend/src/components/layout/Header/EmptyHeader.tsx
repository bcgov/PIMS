import './Header.scss';

import BClogoUrl from 'assets/images/logo-banner.svg';
import PIMSlogo from 'assets/images/PIMSlogo/logo_only.png';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';

const VerticalBar = styled.span`
  border-left: 2px solid white;
  font-size: 34px;
  margin: 0 15px 0 25px;
  vertical-align: top;
`;

/**
 * Display an "empty" header bar with limited functionality as a placeholder
 */
const EmptyHeader = () => {
  return (
    <Navbar expand className="App-header">
      <Navbar.Brand className="brand-box">
        <a target="_blank" rel="noopener noreferrer" href="https://www2.gov.bc.ca/gov/content/home">
          <img
            className="bc-gov-icon"
            src={BClogoUrl}
            width="156"
            height="43"
            alt="Government of BC logo"
          />
        </a>
        <VerticalBar />
        <img className="pims-logo" src={PIMSlogo} height="50" alt="PIMS logo" />
      </Navbar.Brand>
      <Nav className="title mr-auto">
        <Nav.Item>
          <h1 className="longAppName">Property Inventory Management System</h1>
          <h1 className="shortAppName">PIMS</h1>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default EmptyHeader;
