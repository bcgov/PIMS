import './AuthLayout.scss';

import { AppNavBar } from 'components/layout';
import { AuthStateContext } from 'contexts/authStateContext';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';

import PublicLayout from './PublicLayout';

const AuthLayout: React.FC = ({ children }) => {
  const { obj: keycloak } = useKeycloakWrapper();

  return (
    <AuthStateContext.Consumer>
      {context => {
        if (!context.ready) {
          return <Spinner animation="border"></Spinner>;
        }

        return (
          <PublicLayout>
            {!!keycloak?.authenticated && (
              <Container fluid className="App-navbar px-0">
                <Container className="px-0">
                  <AppNavBar />
                </Container>
              </Container>
            )}
            <Container fluid className="d-flex flex-column flex-grow-1" style={{ padding: 0 }}>
              <Row className="w-100 h-100">
                <Col>{children}</Col>
              </Row>
            </Container>
          </PublicLayout>
        );
      }}
    </AuthStateContext.Consumer>
  );
};

export default AuthLayout;
