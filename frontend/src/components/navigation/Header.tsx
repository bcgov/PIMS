import React, { useState } from 'react';
import { Navbar, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import './Header.scss';
import logoUrl from './logo-banner.svg';
import { useHistory } from 'react-router-dom';
import { IGenericNetworkAction, clear } from 'actions/genericActions';
import { RootState } from 'reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import { FaBomb } from 'react-icons/fa';
import _ from 'lodash';

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  if (history.location.pathname === '/') {
    history.replace('/mapview');
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClear = () => {
    errors.forEach(error => dispatch(clear(error.name)));
    setShow(false);
  };
  const url = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ':' + window.location.port : null
  }`;

  const isNetworkError = (x: any): x is IGenericNetworkAction =>
    (x as IGenericNetworkAction).type === 'ERROR';
  const errors = useSelector<RootState, IGenericNetworkAction[]>(state => {
    const errors: IGenericNetworkAction[] = [];
    _.values(state).forEach(reducer => {
      _.values(reducer)
        .filter(x => x instanceof Object)
        .forEach(action => {
          if (isNetworkError(action)) {
            errors.push(action);
          }
        });
    });
    return errors;
  });
  //TODO: styling - this is a placeholder, need UI.
  const errorModal = (errors: IGenericNetworkAction[]) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Errors</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        {errors.map((error: IGenericNetworkAction, index: number) => (
          <Row key={index} style={{ wordBreak: 'break-all' }}>
            {process.env.NODE_ENV === 'development' ? (
              <Col>
                <abbr title={error.error?.response?.config?.url}>
                  {error.error?.response?.config?.url?.substr(0, 20)}
                </abbr>
                : {error.error?.response?.statusText} data:{' '}
                {JSON.stringify(error.error?.response?.data)}
              </Col>
            ) : (
              <Col>
                <abbr title={error.error?.response?.config?.url}>
                  {error.error?.response?.config?.url?.substr(0, 20)}
                </abbr>
                : ({error.error?.response?.statusText ?? 'unknown'}){' '}
                {error.error?.response?.data?.error}
              </Col>
            )}
          </Row>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClear}>
          Close & Clear Errors
        </Button>
      </Modal.Footer>
    </Modal>
  );
  //example of how to check role: const isAdmin = keycloak?.realmAccess?.roles.includes(USER_ROLES[Permission.ADMIN]) == true;
  return (
    <Navbar fixed="top" expand="xl" className="App-header">
      <Container className="bar" fluid={true}>
        <Row>
          <Col>
            <Row className="brand-box">
              <Col md={2} lg={2}></Col>
              <Col xs={8} sm={6} md={4} lg={1} className="brand">
                <Navbar.Brand href={url}>
                  <img
                    className="bc-gov-icon"
                    src={logoUrl}
                    width="156"
                    height="43"
                    alt="Go to the Government of British Columbia website"
                  />
                </Navbar.Brand>
              </Col>
              <Col xs={3} sm={4} md={2} lg={7} className="title">
                <h1 className="longAppName">Property Inventory Management System</h1>
                <h1 className="shortAppName">PIMS</h1>
              </Col>
            </Row>
          </Col>
          <Col xs={3} sm={3} md={3} lg={1} className="other">
            {errors && errors.length ? (
              <FaBomb size={30} className="errors" onClick={handleShow} />
            ) : null}
          </Col>
        </Row>
      </Container>
      {errorModal(errors)}
    </Navbar>
  );
};

export default Header;
