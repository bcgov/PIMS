import React from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import { AuthStateContext } from 'contexts/authStateContext';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import PublicLayout from './PublicLayout';
import { AppNavBar } from 'components/layout';

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
            <Container fluid style={{ padding: 0 }}>
              {!!keycloak?.authenticated && (
                <Row noGutters>
                  <Col>
                    <AppNavBar />
                  </Col>
                </Row>
              )}
              <Row noGutters>
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
