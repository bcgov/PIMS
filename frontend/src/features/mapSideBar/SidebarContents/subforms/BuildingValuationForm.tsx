import './ValuationForm.scss';

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import EvaluationForm from 'features/properties/components/forms/subforms/EvaluationForm';

interface ITenancyProps {
  formikProps: any;
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
}

export const BuildingValuationForm: React.FC<ITenancyProps> = ({
  formikProps,
  nameSpace,
  disabled,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', name].filter(x => x).join('.');
    },
    [nameSpace],
  );

  return (
    <Col className="building-valuation">
      <Row>
        <h4>Building Valuation</h4>
        <br></br>
      </Row>
      <Row className="val-table">
        <EvaluationForm {...formikProps} nameSpace={withNameSpace('')} disabled={disabled} />
      </Row>
    </Col>
  );
};
