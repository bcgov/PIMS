import './PublicLayout.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import LoadingBar from 'react-redux-loading-bar';
import ErrorBoundary from 'react-error-boundary';
import ErrorModal from 'components/common/ErrorModal';
import { Footer, Header } from 'components/layout';

const PublicLayout: React.FC = ({ children }) => {
  return (
    <>
      <LoadingBar style={{ zIndex: 9999, backgroundColor: '#fcba19', height: '3px' }} />
      <Container fluid className="App">
        <header className="header-layout fixed-top">
          <Container className="px-0">
            <Header />
          </Container>
        </header>

        <main className="App-content">
          <ErrorBoundary FallbackComponent={ErrorModal}>{children}</ErrorBoundary>
        </main>

        <footer className="footer-layout fixed-bottom">
          <Container className="px-0">
            <Footer />
          </Container>
        </footer>
      </Container>
    </>
  );
};

export default PublicLayout;
