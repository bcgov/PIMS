import React from 'react';

import GenericModal from './GenericModal';

/**
 * This component is intended for use with React Error Boundaries.
 * Individual or groups of components can be wrapped using this component: <ErrorBoundary FallbackComponent={ErrorModal}>
 * Wrapped components will display this modal if an uncaught error is thrown.
 * By default this will reload the app at the landing page, but this can be overriden by passing a handClose() function.
 * see https://reactjs.org/docs/error-boundaries.html for more details.
 * @param props
 */
const ErrorModal = (props: any) => {
  return (
    <GenericModal
      title="App Error"
      message={props.error.message}
      okButtonText="Ok"
      handleOk={() => window.location.reload()}
    ></GenericModal>
  );
};

export default ErrorModal;
