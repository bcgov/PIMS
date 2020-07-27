import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastInput } from 'components/common/form';

interface CloseOutSummaryFormProps {
  isReadOnly?: boolean;
}

/**
 * Close out form summary form fields.
 * @param props
 */
const CloseOutSummaryForm = (props: CloseOutSummaryFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Fragment>
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Project Number
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="projectNumber"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Agency
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="agency"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Sub Agency
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="subAgency"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Project Manager(s)
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="manager"
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutSummaryForm;
