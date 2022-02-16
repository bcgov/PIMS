import { FastDatePicker, FastInput, Form } from 'components/common/form';
import { useFormikContext } from 'formik';
import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';

interface CloseOutSignaturesFormProps {
  isReadOnly?: boolean;
}

/** Close out form signatures fields */
const CloseOutSignaturesForm = (props: CloseOutSignaturesFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Fragment>
      <h3>Signed by Chief Financial Officer</h3>
      <Form.Group>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Preliminary Form Signed By
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="preliminaryFormSignedBy"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Final Form Signed by
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="finalFormSignedBy"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Signature Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="preliminaryFormSignedOn"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Signature Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="finalFormSignedOn"
            />
          </Form.Group>
        </Col>
      </Form.Group>
    </Fragment>
  );
};

export default CloseOutSignaturesForm;
