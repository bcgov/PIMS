import './Login.scss';

import PIMSlogo from 'assets/images/PIMSlogo/logo_with_text.png';
import { Jumbotron } from 'components/bootstrap';
import * as actionTypes from 'constants/actionTypes';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'store';
import { IGenericNetworkAction } from 'store';
import { NEW_PIMS_USER } from 'store/slices/hooks/usersActionCreator';

//check to see if user is using Internet Explorer
//as their browser
const usingIE = () => {
  const userAgent = window.navigator.userAgent;
  const isOldIE = userAgent.indexOf('MSIE '); //tag used for IE 10 or older
  const isIE11 = userAgent.indexOf('Trident/'); //tag used for IE11
  if (isOldIE > 0 || isIE11 > 0) return true;
  return false;
};

const Login = () => {
  const location = useLocation();
  const redirect =
    location.pathname && location.pathname !== '/login'
      ? `${location.pathname}${location.search ? '?' + location.search : ''}`
      : '/mapview';

  const [showInstruction, setShowInstruction] = useState(false);
  const keyCloakWrapper = useKeycloakWrapper();
  const keycloak = keyCloakWrapper.obj;
  const isIE = usingIE();
  const activated = useAppSelector(
    (store) => (store.network as any)[actionTypes.ADD_ACTIVATE_USER] as IGenericNetworkAction,
  );
  if (!keycloak) {
    return <Spinner animation="border"></Spinner>;
  }
  if (keycloak?.authenticated) {
    if (activated?.status === NEW_PIMS_USER || !keyCloakWrapper?.roles?.length) {
      return <Navigate to={{ pathname: '/access/request' }} />;
    }
    return <Navigate to={redirect || '/mapview'} />;
  }
  if (isIE) {
    return <Navigate to={{ pathname: '/ienotsupported' }} />;
  }
  return (
    <Container className="login" fluid={true}>
      <Container className="unauth" fluid={true}>
        <img className="pims-logo" src={PIMSlogo} alt="PIMS logo" />
        <Row className="sign-in">
          <Col xs={1} md={3} />
          <Col xs={16} md={6} className="block">
            <h1>Search and visualize government property information</h1>
            <h6>
              PIMS enables you to search properties owned by the Government of British Columbia
            </h6>
            <p>
              The data provided can assist your agency in making informed, timely, and strategic
              decisions on the optimal use of real property assets on behalf of the people and
              priorities of British Columbia.
            </p>
            <Button variant="primary" onClick={() => keycloak.login()}>
              Sign In
            </Button>
            <p>Sign into PIMS with your government issued IDIR or with your Business BCeID.</p>
            <Row className="bceid">
              <Button variant="link" onClick={() => setShowInstruction(!showInstruction)}>
                Don't have a Business BCeID?
              </Button>
            </Row>
            <Row>
              {showInstruction && (
                <Jumbotron>
                  <p>
                    1. Search to see if your entity is{' '}
                    <a
                      href="https://www.bceid.ca/directories/whitepages"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      already registered
                    </a>{' '}
                    <FaExternalLinkAlt />
                  </p>
                  <p>
                    If you're not yet registered, <br></br>2.{' '}
                    <a
                      href="https://www.bceid.ca/os/?7169"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register for your Business BCeID
                    </a>{' '}
                    <FaExternalLinkAlt />
                  </p>
                </Jumbotron>
              )}
            </Row>
          </Col>
          <Col xs={1} md={3} />
        </Row>
      </Container>
    </Container>
  );
};

export default Login;
