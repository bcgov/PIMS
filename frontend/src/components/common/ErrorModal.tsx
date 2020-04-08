import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

import { useHistory } from 'react-router-dom';

/**
 * This component is intended for use with React Error Boundaries.
 * Individual or groups of components can be wrapped using this component: <ErrorBoundary FallbackComponent={ErrorModal}>
 * Wrapped components will display this modal if an uncaught error is thrown.
 * By default this will reload the app at the landing page, but this can be overriden by passing a handClose() function.
 * see https://reactjs.org/docs/error-boundaries.html for more details.
 * @param props
 */
const ErrorModal = (props: any) => {
  const history = useHistory();
  const [show, setShow] = useState(true);
  const handleClose =
    props.handleClose ??
    (() => {
      history.push('/');
      window.location.reload(false);
    });
  const close = () => {
    setShow(false);
    handleClose();
  };

  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>App Error</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '500px' }}>{props.error.message}</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ErrorModal;
