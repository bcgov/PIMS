import './Login.scss';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Jumbotron } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IGenericNetworkAction } from 'actions/genericActions';
import { RootState } from 'reducers/rootReducer';
import { NEW_PIMS_USER } from 'actionCreators/usersActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import * as actionTypes from 'constants/actionTypes';
import { useQuery } from 'hooks/use-query';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Login = () => {
  const { redirect } = useQuery();
  const [showInstruction, setShowInstruction] = useState(false);
  const keyCloakWrapper = useKeycloakWrapper();
  const keycloak = keyCloakWrapper.obj;
  const activated = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.ADD_ACTIVATE_USER] as IGenericNetworkAction,
  );
  if (!keycloak) {
    return <Spinner animation="border"></Spinner>;
  }
  if (keycloak?.authenticated) {
    if (activated?.status === NEW_PIMS_USER || !keyCloakWrapper?.roles?.length) {
      return <Redirect to={{ pathname: '/access/request' }} />;
    }
    return <Redirect to={redirect || '/mapview'} />;
  }

  return (
    <Container className="unauth" fluid={true}>
      <h1>Search and visualize government property information</h1>
      <Row className="sign-in">
        <Col xs={1} md={3} />
        <Col xs={16} md={6} className="block">
          <h6>PIMS enables you to search properties owned by the Government of British Columbia</h6>
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
                  <a href="https://www.bceid.ca/os/?7169" target="_blank" rel="noopener noreferrer">
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
  );
};

export default Login;
