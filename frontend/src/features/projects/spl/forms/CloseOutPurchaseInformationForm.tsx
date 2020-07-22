import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastInput, FastCurrencyInput } from 'components/common/form';

interface CloseOutPurchaseInformationFormProps {
  isReadOnly?: boolean;
}

/** Close out form purchase information fields */
const CloseOutPurchaseInformationForm = (props: CloseOutPurchaseInformationFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Fragment>
      <h3>Purchase Information</h3>
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Name of Purchaser
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="purchaser"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Real Estate Agent
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="realtor"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Real Estate Agent Rate
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="realtorRate"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Real Estate Commission Paid
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="realtorCommission"
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutPurchaseInformationForm;
