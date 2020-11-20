import React from 'react';
import { Col, Row } from 'react-bootstrap';
import EvaluationForm from 'features/properties/components/forms/subforms/EvaluationForm';

interface ITenancyProps {
  formikProps: any;
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
  index?: any;
}

export const BuildingValuationForm: React.FC<ITenancyProps> = ({
  formikProps,
  nameSpace,
  index,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );

  return (
    <Col className="building-valuation">
      <Row>
        <h4>Building Valuation Information</h4>
        <br></br>
      </Row>
      <Row>
        <EvaluationForm {...formikProps} nameSpace={withNameSpace('financials')} />
      </Row>
    </Col>
  );
};
