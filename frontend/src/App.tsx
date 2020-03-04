import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import './App.scss';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import MapView from './pages/MapView';
import GuestAccessPage from './pages/GuestAccessPage';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { Spinner } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import configureStore from "configureStore";
import { useKeycloak } from '@react-keycloak/web';
import { getActivateUserAction } from 'actionCreators/authActionCreator';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { IGenericNetworkAction } from 'actions/genericActions';

export const store = configureStore();

const App = () => {
  const { keycloak } = useKeycloak();
  const [keycloakUserLoaded, setkeycloakUserLoaded] = useState({});
  const dispatch = useDispatch();
  const activated = useSelector<RootState, IGenericNetworkAction>(state => (state.activateUser as IGenericNetworkAction));

  useEffect(() => {
    dispatch(getActivateUserAction());
    keycloak?.loadUserProfile().then(() => { setkeycloakUserLoaded(true) });
  }, []);

  const isInitialized = () => {
    return (!keycloak?.authenticated || keycloak?.profile);
  }

  const GoToGuestPage = () => {
    if ((activated && activated.status === 201) || !keycloak?.realmAccess?.roles?.length) {
      return <Redirect to={{ pathname: '/guest' }} />;
    }
    return null;
  }

  return isInitialized() ? (
    <Router>
      <Container className="App" fluid={true}>
        <Header></Header>
        <Row className="App-content">
          <GoToGuestPage />
          <Route path="/" component={Login}></Route>
          <PrivateRoute path="/guest" component={GuestAccessPage}></PrivateRoute>
          <PrivateRoute
            path="/mapview"
            component={MapView}
          />
        </Row>
        <Footer></Footer>
      </Container>
    </Router>
  ) : <Spinner animation="border"></Spinner>;
}

export default App;
