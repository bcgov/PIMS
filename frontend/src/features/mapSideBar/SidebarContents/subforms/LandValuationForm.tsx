import './ValuationForm.scss';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import EvaluationForm from 'features/properties/components/forms/subforms/EvaluationForm';
import { useFormikContext } from 'formik';

interface ITenancyProps {
  title: string;
  disabled?: boolean;
  nameSpace?: string;
  index?: any;
  showImprovements?: boolean;
}
/**
 * Display valuation tables for assessed and netbook values.
 * @param {ITenancyProps} param0
 */
export const LandValuationForm: React.FC<ITenancyProps> = ({
  title,
  disabled,
  nameSpace = '',
  showImprovements,
}) => {
  const formikProps = useFormikContext();
  return (
    <Col className="land-valuation">
      <Row>
        <h4>{title}</h4>
        <br></br>
      </Row>
      <Row className="val-table">
        <EvaluationForm
          disabled={disabled}
          {...(formikProps as any)}
          isParcel={true}
          showAppraisal={false}
          nameSpace={nameSpace}
          showImprovements={showImprovements}
        />
      </Row>
    </Col>
  );
};
