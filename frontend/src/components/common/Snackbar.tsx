import React, { useEffect } from 'react';
import { Alert, Toast } from 'react-bootstrap';
import styled from 'styled-components';

const ToastContainer = styled(Toast)`
  max-width: 100%;
  width: 100%;
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
  useEffect(() => {
    // Send data to Snowplow.
    if (variant === 'danger') {
      window.snowplow('trackSelfDescribingEvent', {
        schema: 'iglu:ca.bc.gov.pims/error/jsonschema/1-0-0',
        data: {
          error_message: `Snackbar Error: ${message}`,
        },
      });
    }
  }, []);

  return (
    <ToastContainer show={show} delay={5000} autohide={true} onClose={onClose}>
      {show && <AlertMessage variant={variant}>{message}</AlertMessage>}
    </ToastContainer>
  );
};
