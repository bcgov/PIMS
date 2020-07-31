import * as React from 'react';
import styled from 'styled-components';
import { Alert, Toast } from 'react-bootstrap';

const ToastContainer = styled(Toast)`
  max-width: 100%;
`;

const AlertMessage = styled(Alert)`
  margin: 0;
`;

export interface ISnackbarState {
  variant?: 'success' | 'danger';
  message?: string;
  show?: boolean;
}

interface ISnackbar extends ISnackbarState {
  onClose: () => void;
}

export const Snackbar: React.FC<ISnackbar> = ({ onClose, message, show, variant }) => {
  return (
    <ToastContainer show={show} delay={5000} autohide={true} onClose={onClose}>
      {show && <AlertMessage variant={variant}>{message}</AlertMessage>}
    </ToastContainer>
  );
};
