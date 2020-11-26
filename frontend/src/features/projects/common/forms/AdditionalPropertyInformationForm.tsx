import React from 'react';
import { Container } from 'react-bootstrap';
import { Form, FastInput, FastFiscalYearInput, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';

interface IAdditionalPropertyInformationFormProps {
  isReadOnly?: boolean;
}

/**
 * Surplus Properties information - in addition to standard property information.
 * @param param0 isReadOnly disable editing
 */
const AdditionalPropertyInformationForm = ({
  isReadOnly,
}: IAdditionalPropertyInformationFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Container fluid>
      <Form.Row>
        <Form.Label column md={3}>
          Project Approved On
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="approvedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Manager Names
        </Form.Label>
        <FastInput
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="manager"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Reported Fiscal Year
        </Form.Label>
        <FastFiscalYearInput
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="reportedFiscalYear"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Actual or Forecasted Fiscal Year of Sale
        </Form.Label>
        <FastFiscalYearInput
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="actualFiscalYear"
        />
      </Form.Row>
    </Container>
  );
};

export default AdditionalPropertyInformationForm;
