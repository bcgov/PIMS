import './ValuationForm.scss';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import EvaluationForm from 'features/properties/components/forms/subforms/EvaluationForm';
import { useFormikContext } from 'formik';

interface ITenancyProps {
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
  index?: any;
}

export const LandValuationForm: React.FC<ITenancyProps> = () => {
  const formikProps = useFormikContext();
  return (
    <Col className="land-valuation">
      <Row>
        <h4>Raw Land Valuation</h4>
        <br></br>
      </Row>
      <Row className="val-table">
        <EvaluationForm
          {...(formikProps as any)}
          isParcel={true}
          showAppraisal={false}
          nameSpace="data.financials"
        />
      </Row>
    </Col>
  );
};
