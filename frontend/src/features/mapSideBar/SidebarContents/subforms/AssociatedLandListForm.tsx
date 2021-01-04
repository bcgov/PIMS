import './AssociatedBuildingListForm.scss';
import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { FormikTable } from 'features/projects/common';
import { getAssociatedLandCols } from '../../../properties/components/forms/subforms/columns';

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
export const AssociatedLandListForm: React.FC<ITenancyProps> = ({ title, nameSpace }) => {
  const withNameSpace: Function = (fieldName: string) => {
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <Col className="associated-properties">
      <Row>
        <h4>{title}</h4>
        <p>
          The following land is associated in PIMS with this building.
          <br />
          You will have an opportunity to associate more land (if required) after the Review &
          Update step.{' '}
        </p>
      </Row>
      <Row>
        <Form.Row>
          <FormikTable
            field={withNameSpace('parcels')}
            name="parcels"
            columns={getAssociatedLandCols()}
          />
        </Form.Row>
      </Row>
    </Col>
  );
};
