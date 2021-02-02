import './AssociatedBuildingListForm.scss';
import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { FormikTable } from 'features/projects/common';
import { getAssociatedBuildingsCols } from '../../../properties/components/forms/subforms/columns';

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
export const AssociatedBuildingListForm: React.FC<ITenancyProps> = ({ title, nameSpace }) => {
  const withNameSpace: Function = (fieldName: string) => {
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <Col className="associated-properties">
      <Row>
        <h4>{title}</h4>
        <p>
          The following building(s) are associated in PIMS with this land.
          <br />
          To associate more buildings, find/create the building(s) within PIMS and go to the
          Associated Land step.{' '}
        </p>
      </Row>
      <Row>
        <Form.Row>
          <FormikTable
            field={withNameSpace('buildings')}
            name="buildings"
            columns={getAssociatedBuildingsCols()}
          />
        </Form.Row>
      </Row>
    </Col>
  );
};
