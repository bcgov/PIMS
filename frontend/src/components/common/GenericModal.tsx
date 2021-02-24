import React, { useState, useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import classNames from 'classnames';

export enum ModalSize {
  XLARGE = 'modal-xl',
  LARGE = 'modal-l',
  MEDIUM = 'modal-m',
  SMALL = 'modal-s',
}

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
  message?: string | React.ReactNode;
  /** allows the parent component to control the display of this modal.
   * Default behaviour is to show this modal on creation and close it on button click. */
  display?: boolean;
  /** set the value of the externally tracked display prop above. */
  setDisplay?: (display: boolean) => void;
  /** optional override to control the x button in the top right of the modal. Default is to show. */
  closeButton?: boolean;
  /** provide the size of the modal, default width is 500px */
  size?: ModalSize;
}

/**
 * Generic Component used to display modal popups to the user.
 * @param props customize the component with custom text, and an operation to take when the component is closed.
 */
const GenericModal = (props: ModalProps) => {
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
    props.setDisplay && props.setDisplay(false);
    handleCancel();
  };

  const handleOk =
    props.handleOk ??
    (() => {
      props.setDisplay && props.setDisplay(false);
      setShow(false);
    });
  const ok = () => {
    props.setDisplay && props.setDisplay(false);
    setShow(false);
    handleOk();
  };

  return (
    <Container>
      <Modal show={show} onHide={close} dialogClassName={classNames(props.size)}>
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
              variant={props.cancelButtonVariant ?? 'secondary'}
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
