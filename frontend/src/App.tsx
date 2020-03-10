import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MapView from './pages/MapView';
import GuestAccessPage from './pages/GuestAccessPage';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { Spinner } from 'react-bootstrap';
import configureStore from 'configureStore';
import { getActivateUserAction } from 'actionCreators/authActionCreator';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from 'components/navigation/AppNavBar';
import AccessDenied from 'pages/AccessDenied';
import Administration from 'pages/Administration';
import { ADMINISTRATOR } from 'constants/strings';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

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
    keycloak?.loadUserProfile().then(() => {
      setkeycloakUserLoaded(true);
    });
  }, []);

  const isInitialized = () => {
    return !keycloak?.authenticated || keycloak?.profile;
  };

  return isInitialized() ? (
    <Router>
      <Container className="App" fluid={true}>
        <Header />

        <Row className="App-content">
          {keycloak?.authenticated ? <AppNavBar /> : null}
          <Col style={{ padding: 0 }}>
            <Route path="/" component={Login}></Route>
            <PrivateRoute path="/accessdenied" component={AccessDenied}></PrivateRoute>
            <PrivateRoute
              path="/admin"
              component={Administration}
              role={ADMINISTRATOR}
            ></PrivateRoute>
            <PrivateRoute path="/guest" component={GuestAccessPage}></PrivateRoute>
            <PrivateRoute path="/mapview" component={MapView} />
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
