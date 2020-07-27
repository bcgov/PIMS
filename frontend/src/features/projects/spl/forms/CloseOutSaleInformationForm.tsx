import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastDatePicker, FastFiscalYearInput, FastInput } from 'components/common/form';
import { FormikTable, IProject } from 'features/projects/common';
import { getAppraisedColumns } from 'features/projects/common/components/columns';

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
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Sales Completion Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="disposedOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Sales Adjustment Date
            </Form.Label>
            <FastDatePicker
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="adjustedOn"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Actual Fiscal Year of Sale
            </Form.Label>
            <FastFiscalYearInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="actualFiscalYear"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Best Information of Future Planned Use
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="plannedFutureUse"
            />
          </Form.Row>
        </Col>
      </Form.Row>
      <h3>Appraisal</h3>
      <Form.Row>
        <FormikTable
          field="properties"
          name="properties"
          columns={getAppraisedColumns(formikProps.values)}
        />
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutSaleInformation;
