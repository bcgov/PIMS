import './TenancyForm.scss';

import { FastInput, InputGroup, SelectOptions } from 'components/common/form';
import { Label } from 'components/common/Label';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

interface IOccupancyProps {
  formikProps: any;
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
  index?: any;
  occupantTypes: SelectOptions;
}

const InfoSection = styled.div`
  margin-left: 20px;
  margin-bottom: 20px;
`;

export const OccupancyForm: React.FC<IOccupancyProps> = ({
  formikProps,
  disabled,
  readOnly,
  occupantTypes,
  nameSpace,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', name].filter(x => x).join('.');
    },
    [nameSpace],
  );
  return (
    <Col className="tenancy">
      <Row>
        <h4>Occupancy</h4>
      </Row>
      <InfoSection>
        <Row>
          <Label>Total Area</Label>
          <InputGroup
            displayErrorTooltips
            fast={true}
            formikProps={formikProps}
            disabled={disabled || readOnly}
            type="number"
            field={withNameSpace('squareFootage')}
            postText="Sq. M"
            required
          />
        </Row>
        <Row>
          <Label>Net Rentable Area</Label>
          <InputGroup
            displayErrorTooltips
            fast={true}
            formikProps={formikProps}
            disabled={disabled || readOnly}
            type="number"
            field={withNameSpace('rentableArea')}
            postText="Sq. M"
            required
          />
        </Row>
      </InfoSection>
      <Row>
        <h4>Tenants</h4>
      </Row>
      <InfoSection>
        <Row>
          <Label>Tenancy %</Label>
          <FastInput
            displayErrorTooltips
            formikProps={formikProps}
            className="percentage"
            disabled={disabled || readOnly}
            field={withNameSpace('buildingTenancy')}
          />
        </Row>
      </InfoSection>
    </Col>
  );
};
