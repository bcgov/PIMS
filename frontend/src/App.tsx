import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MapView from './pages/MapView';
import GuestAccessPage from './pages/GuestAccessPage';
import EditUserPage from './pages/EditUserPage';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { Spinner } from 'react-bootstrap';
import configureStore from 'configureStore';
import { getActivateUserAction } from 'actionCreators/usersActionCreator';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from 'components/navigation/AppNavBar';
import AccessDenied from 'pages/AccessDenied';
import Administration from 'pages/Administration';
import { SYSTEM_ADMINISTRATOR } from 'constants/strings';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import SubmitProperty from 'pages/SubmitProperty';
import LoadingBar from 'react-redux-loading-bar';
import ErrorBoundary from 'react-error-boundary';
import ErrorModal from 'components/common/ErrorModal';
import { AuthStateContext, IAuthState } from 'contexts/authStateContext';

export const store = configureStore();

const App = () => {
  const keycloakWrapper = useKeycloakWrapper();
  const keycloak = keycloakWrapper.obj;
  const dispatch = useDispatch();

  useEffect(() => {
    if (keycloak?.authenticated) {
      dispatch(getActivateUserAction());
      dispatch(getFetchLookupCodeAction());
    }
  }, []);

  return (
    <AuthStateContext.Consumer>
      {(context: IAuthState) => {
        if (!context.ready) {
          return <Spinner animation="border"></Spinner>;
        }

        return (
          <Router>
            <LoadingBar style={{ zIndex: 9999, backgroundColor: '#fcba19', height: '3px' }} />
            <Container className="App" fluid={true}>
              <Header />
              <ErrorBoundary FallbackComponent={ErrorModal}>
                <Row className="App-content">
                  {keycloak?.authenticated ? <AppNavBar /> : null}
                  <Col style={{ padding: 0 }}>
                    <Route path="/login" component={Login}></Route>
                    <PrivateRoute path="/accessdenied" component={AccessDenied}></PrivateRoute>
                    <PrivateRoute
                      path="/admin"
                      component={Administration}
                      role={SYSTEM_ADMINISTRATOR}
                    ></PrivateRoute>
                    <PrivateRoute path="/guest" component={GuestAccessPage}></PrivateRoute>
                    <PrivateRoute path="/accessdenied" component={AccessDenied}></PrivateRoute>
                    <PrivateRoute path="/mapView" component={MapView} />
                    <PrivateRoute path="/submitProperty/:id?" component={SubmitProperty} />
                    <PrivateRoute path="/edituser" component={EditUserPage} />
                  </Col>
                </Row>
              </ErrorBoundary>
              <Footer />
            </Container>
          </Router>
        );
      }}
    </AuthStateContext.Consumer>
  );
};

export default App;
