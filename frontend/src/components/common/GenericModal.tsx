import React, { useState, useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

import { useHistory } from 'react-router-dom';

interface ModalProps {
  /** Optional function to control behaviour of cancel button. Default is to close the modal. */
  handleCancel?: Function;
  /** Optional function to control behaviour of ok button. Default is to reload the app. */
  handleOk?: Function;
  /** Optional text to display on the cancel button. Default is Cancel. */
  cancelButtonText?: string;
  /** Optional variant that will override the default variant of warning. */
  cancelButtonVariant?:
    | 'link'
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'dark'
    | 'light'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';
  /** Optional test to display on the ok button. Default is Ok. */
  okButtonText?: string;
  /** Optional variant that will override the default variant of primary. */
  okButtonVariant?:
    | 'link'
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'dark'
    | 'light'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';
  /** Optional title to display - no default. */
  title?: string;
  /** Optional message to display - no default. */
  message?: string;
  /** allows the parent component to control the display of this modal.
   * Default behaviour is to show this modal on creation and close it on button click. */
  display?: boolean;
  /** optional override to control the x button in the top right of the modal. Default is to show. */
  closeButton?: boolean;
}

/**
 * Generic Component used to display modal popups to the user.
 * @param props customize the component with custom text, and an operation to take when the component is closed.
 */
const GenericModal = (props: ModalProps) => {
  const history = useHistory();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (props.display !== undefined) {
      setShow(props.display);
    }
  }, [props.display]);

  const emptyFunction = () => {};
  const handleCancel = props.handleCancel ?? emptyFunction;

  const close = () => {
    setShow(false);
    handleCancel();
  };

  const handleOk =
    props.handleOk ??
    (() => {
      history.push('/');
    });
  const ok = () => {
    setShow(false);
    handleOk();
  };

  return (
    <Container>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton={props.closeButton}>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '500px' }}>{props.message}</Modal.Body>

        <Modal.Footer>
          <Button variant={props.okButtonVariant ?? 'primary'} onClick={ok}>
            {props.okButtonText ?? 'Ok'}
          </Button>
          {props.cancelButtonText && (
            <Button
              variant={props.cancelButtonVariant ?? 'warning'}
              onClick={close}
              style={{ width: 'unset' }}
            >
              {props.cancelButtonText}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GenericModal;
