import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastDatePicker, FastCurrencyInput } from 'components/common/form';
import { ProjectNotes } from 'features/projects/common';

interface CloseOutAdjustmentProps {
  isReadOnly?: boolean;
}

/**
 * Close out form adjustment fields
 * @param props
 */
const CloseOutAdjustment = (props: CloseOutAdjustmentProps) => {
  const formikProps = useFormikContext();
  return (
    <Fragment>
      <h3>Adjustment to Prior Year Sale</h3>
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Adjustment to Prior Year Sale Amount
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="priorYearAdjustmentAmount"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row></Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Adjustment to Prior Year Sale Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="priorYearAdjustmentOn"
            />
          </Form.Row>
        </Col>
      </Form.Row>
      <ProjectNotes
        label="Adjustment to Prior Year Sale Notes"
        field="adjustmentNote"
        className="col-md-auto"
        outerClassName="col-md-12"
      />
    </Fragment>
  );
};

export default CloseOutAdjustment;
