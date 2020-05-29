import './Header.scss';

import React, { useState } from 'react';
import { Navbar, Row, Col, Modal, Button, Nav } from 'react-bootstrap';
import logoUrl from 'assets/images/logo-banner.svg';
import { useHistory, Link } from 'react-router-dom';
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
  return (
    <Navbar expand className="App-header">
      <Navbar.Brand className="brand-box">
        <Link to="/">
          <img
            className="bc-gov-icon"
            src={logoUrl}
            width="156"
            height="43"
            alt="Go to the Government of British Columbia website"
          />
        </Link>
      </Navbar.Brand>
      <Nav className="title mr-auto">
        <Nav.Item>
          <h1 className="longAppName">Property Inventory Management System</h1>
          <h1 className="shortAppName">PIMS</h1>
        </Nav.Item>
      </Nav>
      <Nav className="other">
        {errors && errors.length ? (
          <FaBomb size={30} className="errors" onClick={handleShow} />
        ) : null}
      </Nav>
      {errorModal(errors)}
    </Navbar>
  );
};

export default Header;
