import React, { useState } from 'react';
import { Modal, Row, Col, Button, Container } from 'react-bootstrap';

import { IGenericNetworkAction } from 'actions/genericActions';
import { useHistory } from 'react-router-dom';

const ErrorModal = (props: any) => {
  const history = useHistory();
  const [show, setShow] = useState(true);
  const handleClose = () => {
    history.push('/');
    window.location.reload(false);
  };

  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>App Error</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '500px' }}>{props.error.message}</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ErrorModal;
