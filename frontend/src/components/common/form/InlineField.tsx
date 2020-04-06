import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import { Input } from '.';

interface InlineFieldProps {
  field: string;
  label: string;
  child: Component;
}

const InlineField = (props: InlineFieldProps) => (
  <Form.Row>
    <Form.Label column md={3}>
      {props.label}
    </Form.Label>
    <Col md={9}>
      <Component field={props.field} />
    </Col>
  </Form.Row>
);

export default InlineField;
