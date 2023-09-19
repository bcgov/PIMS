import './UploadProperties.scss';

import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

export const UploadProperties: React.FC = () => {
  return (
    <div className="csv-upload-page">
      <Container>
        <Row>
          <Col id="instructions" xs={4} className="box"></Col>
          <Col className="box"></Col>
        </Row>
      </Container>
    </div>
  );
};
