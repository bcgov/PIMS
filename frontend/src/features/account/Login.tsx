import './Login.scss';

import PIMSlogo from 'assets/images/PIMSlogo/logo_with_text.png';
import { Jumbotron } from 'components/bootstrap';
import * as actionTypes from 'constants/actionTypes';
import { useConfiguration } from 'hooks/useConfiguration';
import { IKeycloak, useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { INetworkState, IRequest, useAppSelector } from 'store';
import { NEW_PIMS_USER } from 'store/slices/hooks/usersActionCreator';

/**
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 * @description Check if the user is using Internet Explorer.
 * @returns A boolean value indicating whether the user is using Internet Explorer.
 */
const isUsingIE = (): boolean =>
  navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1;

/**
 * @description This component works as the initial landing page for the application.
 * This component will also redirect the user to the /ienotsupported page, if the user is using Internet Explorer.
 *
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 *
 * @example
 * <Login />
 */
const Login = () => {
  const navigate: NavigateFunction = useNavigate();
  const configuration = useConfiguration();

  if (isUsingIE()) {
    navigate('/ienotsupported');
  }

  const location: Location = useLocation();
  const redirect: string =
    location.pathname && location.pathname !== '/login'
      ? `${location.pathname}${location.search ? '?' + location.search : ''}`
      : '/mapview';

  const keyCloakWrapper: IKeycloak = useKeycloakWrapper();
  const keycloak = keyCloakWrapper.obj;
  const [showInstruction, setShowInstruction] = useState(false);

  const networkState: INetworkState = useAppSelector((state) => state.network);

  useEffect(() => {
    const activateRequest: IRequest = networkState?.requests?.[actionTypes.ADD_ACTIVATE_USER];

    const isWaitingOnActivateRequest: boolean = activateRequest?.isFetching ?? false;
    const isUserLoggedIn: boolean = keycloak?.authenticated;

    if (isUserLoggedIn && !isWaitingOnActivateRequest) {
      const isNewUser: boolean =
        activateRequest?.status === NEW_PIMS_USER || !keyCloakWrapper?.roles?.length;

      if (isNewUser) {
        navigate('/access/request');
      } else {
        navigate(redirect || 'mapview');
      }
    }
  }, [networkState]);

  if (!keycloak) {
    return <Spinner animation="border"></Spinner>;
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
            <Button
              variant="primary"
              onClick={() => keycloak.login({ redirectUri: configuration.keycloakRedirectURI })}
            >
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
        </Row>
      </Container>
    </Container>
  );
};

export default Login;
