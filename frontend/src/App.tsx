import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MapView from './pages/MapView';
import AccessRequestPage from './pages/AccessRequestPage';
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
import ManageUsers from 'pages/ManageUsers';
import ManageAccessRequests from 'pages/ManageAccessRequests';
import { Claims } from 'constants/claims';
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
                    <Route path="/forbidden" component={AccessDenied}></Route>
                    <PrivateRoute
                      path="/admin/users"
                      component={ManageUsers}
                      claim={Claims.ADMIN_USERS}
                    ></PrivateRoute>
                    <PrivateRoute
                      path="/admin/access/requests"
                      component={ManageAccessRequests}
                      claim={Claims.ADMIN_USERS}
                    ></PrivateRoute>
                    <PrivateRoute
                      path="/access/request"
                      component={AccessRequestPage}
                    ></PrivateRoute>
                    <PrivateRoute
                      path="/mapView"
                      component={MapView}
                      claim={Claims.PROPERTY_VIEW}
                    />
                    <PrivateRoute
                      path="/submitProperty/:id?"
                      component={SubmitProperty}
                      claim={Claims.PROPERTY_ADD}
                    />
                    <PrivateRoute
                      path="/admin/user"
                      component={EditUserPage}
                      claim={Claims.ADMIN_USERS}
                    />
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
