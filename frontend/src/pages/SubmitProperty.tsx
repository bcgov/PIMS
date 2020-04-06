import './SubmitProperty.scss';

import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import ParcelDetailForm from 'forms/ParcelDetailForm';
import MapView from './MapView';

const SubmitProperty = () => {
  return (
    <Row className="submitProperty">
      <Col md={7} className="form">
        <ParcelDetailForm />
      </Col>
      <Col md={5} className="sideMap">
        <MapView disableMapFilterBar={true} />
      </Col>
    </Row>
  );
};

export default SubmitProperty;
