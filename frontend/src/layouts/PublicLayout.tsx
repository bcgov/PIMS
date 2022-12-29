import './PublicLayout.scss';

import classNames from 'classnames';
import ErrorModal from 'components/common/ErrorModal';
import { Footer, Header } from 'components/layout';
import React from 'react';
import { Container } from 'react-bootstrap';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingBar from 'react-redux-loading-bar';

const PublicLayout: React.FC = ({ children }) => {
  // Change styling based on environment
  let environment = 'production';
  if (window.location.href.includes('localhost')) environment = 'local';
  else if (window.location.href.includes('dev')) environment = 'development';
  else if (window.location.href.includes('test')) environment = 'testing';

  return (
    <>
      <LoadingBar style={{ zIndex: 9999, backgroundColor: '#fcba19', height: '3px' }} />
      <Container fluid className="App">
        <header
          className={classNames(
            { 'dev-environment': environment === 'development' },
            { 'test-environment': environment === 'testing' },
            { 'local-environment': environment === 'local' },
            'header-layout',
            'fixed-top',
          )}
        >
          <Container className="px-0">
            <Header />
          </Container>
        </header>

        <main className="App-content">
          <ErrorBoundary FallbackComponent={ErrorModal}>{children}</ErrorBoundary>
        </main>

        <footer
          className={classNames(
            { 'dev-environment': environment === 'development' },
            { 'test-environment': environment === 'testing' },
            { 'local-environment': environment === 'local' },
            'footer-layout',
            'fixed-bottom',
          )}
        >
          <Container className="px-0">
            <Footer />
          </Container>
        </footer>
      </Container>
    </>
  );
};

export default PublicLayout;
