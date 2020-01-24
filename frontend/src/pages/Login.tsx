import { Redirect } from 'react-router-dom';
import { useKeycloak } from 'react-keycloak';
import { Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import React from 'react';
import './Login.scss';

function Login() {
  const { keycloak } = useKeycloak();

  if (keycloak.authenticated) {
    return <Redirect to={{ pathname: '/mapview' }} />;
  }

  return (
    <Container className="unauth" fluid={true}>
      <h1>Search and manage government properties</h1>
      <Row>
        <Col xs={1} md={3}/>
        <Col xs={16} md={6} className="block">
          <p className="blockText">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Praesent libero nibh, venenatis a ligula a, mattis porta lacus.
            Praesent sagittis sed velit eget interdum.
            In cursus pellentesque dui vitae efficitur.
          </p>
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
