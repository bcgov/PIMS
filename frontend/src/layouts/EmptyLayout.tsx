import './PublicLayout.scss';

import { EmptyHeader, Footer } from 'components/layout';
import React from 'react';
import { Container } from 'react-bootstrap';

const EmptyLayout: React.FC = ({ children }) => {
  return (
    <>
      <Container fluid className="App">
        <header className="header-layout fixed-top">
          <Container className="px-0">
            <EmptyHeader />
          </Container>
        </header>

        <main className="App-content">{children}</main>

        <footer className="footer-layout fixed-bottom">
          <Container className="px-0">
            <Footer />
          </Container>
        </footer>
      </Container>
    </>
  );
};

export default EmptyLayout;
