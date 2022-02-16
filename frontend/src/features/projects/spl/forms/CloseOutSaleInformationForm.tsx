import { FastDatePicker, FastFiscalYearInput, FastInput, Form } from 'components/common/form';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';

interface CloseOutSaleInformationProps {
  isReadOnly?: boolean;
}

/**
 * Sale information for the close out form.
 * @param props
 */
const CloseOutSaleInformation = (props: CloseOutSaleInformationProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Fragment>
      <h3>Sale Information</h3>
      <Form.Group>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Sales Completion Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="disposedOn"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Sales Adjustment Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="adjustedOn"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label column md={4}>
              Actual Fiscal Year of Sale
            </Form.Label>
            <FastFiscalYearInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="actualFiscalYear"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Best Information of Future Planned Use
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="plannedFutureUse"
            />
          </Form.Group>
        </Col>
      </Form.Group>
    </Fragment>
  );
};

export default CloseOutSaleInformation;
