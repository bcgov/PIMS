import './Header.scss';

import BClogoUrl from 'assets/images/logo-banner.svg';
import PIMSlogo from 'assets/images/PIMSlogo/logo_only.png';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useState } from 'react';
import { Button, Col, Modal, Nav, Navbar, Row } from 'react-bootstrap';
import { FaBomb } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IGenericNetworkAction, useAppSelector } from 'store';
import { useNetworkStore } from 'store/slices/hooks';
import styled from 'styled-components';

import { UserProfile } from './UserProfile';

const VerticalBar = styled.span`
  border-left: 2px solid white;
  font-size: 34px;
  margin: 0 15px 0 25px;
  vertical-align: top;
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
  const network = useNetworkStore();
  const { requests } = useAppSelector((store) => store.network);

  // Change styling based on environment
  let environment = 'production';
  if (window.location.href.includes('localhost')) environment = 'local';
  else if (window.location.href.includes('pims-dev')) environment = 'development';
  else if (window.location.href.includes('pims-test')) environment = 'testing';

  const [errors, setErrors] = React.useState<IGenericNetworkAction[]>([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClear = () => {
    errors.forEach((error) => network.clearRequest(error.name));
    setShow(false);
  };

  const isNetworkError = (x: any): x is IGenericNetworkAction =>
    (x as IGenericNetworkAction).type === 'ERROR';

  React.useEffect(() => {
    if (location.pathname === '/') {
      navigate('/mapview', { replace: true });
    }
  }, []);

  React.useEffect(() => {
    const errors: IGenericNetworkAction[] = Object.values(requests)
      .filter((o) => o instanceof Object)
      .filter((o) => isNetworkError(o))
      .map((o) => o as IGenericNetworkAction);
    setErrors(errors);
  }, [requests]);

  //TODO: styling - this is a placeholder, need UI.
  const errorModal = (errors: IGenericNetworkAction[]) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Errors</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        {errors.map((error: IGenericNetworkAction, index: number) => {
          return (
            <Row key={index} style={{ wordBreak: 'break-all' }}>
              {process.env.NODE_ENV === 'development' ? (
                <Col>
                  <abbr title={error.error?.response?.config?.url}>
                    {error.error?.response?.config?.url?.substr(0, 20)}
                  </abbr>
                  : {error.error?.response?.statusText} data:{' '}
                  {JSON.stringify(error.error?.response?.data)}
                </Col>
              ) : (
                <Col>
                  <abbr title={error.error?.response?.config?.url}>
                    {error.error?.response?.config?.url?.substr(0, 20)}
                  </abbr>
                  : ({error.error?.response?.statusText ?? 'unknown'}){' '}
                  {JSON.stringify(error.error?.response?.data)}
                </Col>
              )}
            </Row>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClear}>
          Close & Clear Errors
        </Button>
      </Modal.Footer>
    </Modal>
  );
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
      <Nav className="title">
        <Nav.Item>
          {environment === 'production' && (
            <>
              <h1 className="longAppName">Property Inventory Management System</h1>
              <h1 className="shortAppName">PIMS</h1>
            </>
          )}
          {environment === 'development' && (
            <>
              <h1 className="longAppName" style={{ marginRight: '330px' }}>
                PIMS - Development Environment
              </h1>
              <h1 className="shortAppName">PIMS</h1>
            </>
          )}
          {environment === 'testing' && (
            <>
              <h1 className="longAppName" style={{ marginRight: '400px' }}>
                PIMS - Testing Environment
              </h1>
              <h1 className="shortAppName">PIMS</h1>
            </>
          )}
          {environment === 'local' && (
            <>
              <h1 className="longAppName" style={{ marginRight: '420px' }}>
                PIMS - Local Development
              </h1>
              <h1 className="shortAppName">PIMS</h1>
            </>
          )}
        </Nav.Item>
      </Nav>
      {keycloak.obj.authenticated && <UserProfile />}
      <Nav className="other">
        {errors && errors.length ? (
          <FaBomb size={30} className="errors" onClick={handleShow} />
        ) : null}
      </Nav>
      {errorModal(errors)}
    </Navbar>
  );
};

export default Header;
