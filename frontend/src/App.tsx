import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import _ from 'lodash';

export const store = configureStore();

const App = () => {
  const keycloakWrapper = useKeycloakWrapper();
  const keycloak = keycloakWrapper.obj;
  const [keycloakUserLoaded, setkeycloakUserLoaded] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (keycloak?.authenticated) {
      dispatch(getActivateUserAction());
      dispatch(getFetchLookupCodeAction());
    }
    keycloak?.loadUserInfo().then(() => {
      setkeycloakUserLoaded(true);
    });
  }, []);

  const isInitialized = () => {
    return !keycloak?.authenticated || keycloak?.userInfo;
  };

  return isInitialized() ? (
    <Router>
      <LoadingBar style={{ zIndex: 9999, backgroundColor: '#fcba19', height: '3px' }} />
      <Container className="App" fluid={true}>
        <Header />
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
            <PrivateRoute path="/submitProperty" component={SubmitProperty} />
            <PrivateRoute path="/edituser" component={EditUserPage} />
          </Col>
        </Row>
        <Footer />
      </Container>
    </Router>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default App;
