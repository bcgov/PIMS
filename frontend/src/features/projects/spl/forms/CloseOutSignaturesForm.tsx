import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastInput, FastDatePicker } from 'components/common/form';

interface CloseOutSignaturesFormProps {
  isReadOnly?: boolean;
}

/** Close out form signatures fields */
const CloseOutSignaturesForm = (props: CloseOutSignaturesFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Fragment>
      <h3>Signed by Chief Financial Officer</h3>
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Preliminary Form Signed By
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="preliminaryFormSignedBy"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Final Form Signed by
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="finalFormSignedBy"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Signature Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="preliminaryFormSignedOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Signature Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="finalFormSignedOn"
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutSignaturesForm;
