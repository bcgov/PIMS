import { FastInput, Form } from 'components/common/form';
import { useFormikContext } from 'formik';
import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';

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
      <Form.Group>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Project Number
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="projectNumber"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Agency
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="agency"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Sub Agency
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="subAgency"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Project Manager(s)
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="manager"
            />
          </Form.Group>
        </Col>
      </Form.Group>
    </Fragment>
  );
};

export default CloseOutSummaryForm;
