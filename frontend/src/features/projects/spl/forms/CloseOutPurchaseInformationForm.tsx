import { FastCurrencyInput, FastInput, Form } from 'components/common/form';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';

interface CloseOutPurchaseInformationFormProps {
  isReadOnly?: boolean;
}

/** Close out form purchase information fields */
const CloseOutPurchaseInformationForm = (props: CloseOutPurchaseInformationFormProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Fragment>
      <h3>Purchase Information</h3>
      <Form.Group>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Name of Purchaser
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={true}
              outerClassName="col-md-8"
              field="purchaser"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Real Estate Agent
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="realtor"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Real Estate Agent Rate
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="realtorRate"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Real Estate Commission Paid
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-4"
              field="realtorCommission"
            />
          </Form.Group>
        </Col>
      </Form.Group>
      <Form.Group>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Assessed Value
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-4"
              field="assessed"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Appraised Value
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-4"
              field="appraised"
            />
          </Form.Group>
        </Col>
      </Form.Group>
    </Fragment>
  );
};

export default CloseOutPurchaseInformationForm;
