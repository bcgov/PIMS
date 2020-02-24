import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import React from 'react';
import './Login.scss';

function Login() {
  const { keycloak } = useKeycloak();
  if(!keycloak) {
    return <Spinner animation="border"></Spinner>;
  }
  if (keycloak?.authenticated) {
    return <Redirect to={{ pathname: '/mapview' }} />;
  }

  return (
    <Container className="unauth" fluid={true}>
      <h1>Search and manage government properties</h1>
      <Row>
        <Col xs={1} md={3}/>
        <Col xs={16} md={6} className="block">
          <Button variant="primary" onClick={() => keycloak.login()}>
            Sign In
          </Button>
          <p className="or">Or</p>
          <Button className="border border-dark" variant="secondary" >
            Sign Up
          </Button>
        </Col>
        <Col xs={1} md={3}/>
      </Row>
    </Container>
  );
}

export default Login;
