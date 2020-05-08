import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import React from 'react';
import './Login.scss';
import { IGenericNetworkAction } from 'actions/genericActions';
import { RootState } from 'reducers/rootReducer';
import { NEW_PIMS_USER } from 'actionCreators/authActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { PROPERTY_VIEW } from 'constants/strings';

const Login = () => {
  const { keycloak } = useKeycloak();
  const keyCloakWrapper = useKeycloakWrapper();
  const activated = useSelector<RootState, IGenericNetworkAction>(
    state => state.activateUser as IGenericNetworkAction,
  );
  if (!keycloak) {
    return <Spinner animation="border"></Spinner>;
  }
  if (keycloak?.authenticated) {
    if (
      (activated && activated.status === NEW_PIMS_USER) ||
      !keyCloakWrapper.hasRole(PROPERTY_VIEW)
    ) {
      return <Redirect to={{ pathname: '/guest' }} />;
    }
    return <Redirect to={{ pathname: '/mapview' }} />;
  }

  return (
    <Container className="unauth" fluid={true}>
      <h1>Search and manage government properties</h1>
      <Row>
        <Col xs={1} md={3} />
        <Col xs={16} md={6} className="block">
          <Button variant="primary" onClick={() => keycloak.login()}>
            Sign In
          </Button>
          <p className="or">Or</p>
          <Button className="border border-dark" variant="secondary">
            Sign Up
          </Button>
        </Col>
        <Col xs={1} md={3} />
      </Row>
    </Container>
  );
};

export default Login;
