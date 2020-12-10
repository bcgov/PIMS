import './TenancyForm.scss';

import {
  Check,
  FastDatePicker,
  FastInput,
  FastSelect,
  InputGroup,
  SelectOptions,
} from 'components/common/form';
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
          <Label required>Total Square Footage</Label>
          <InputGroup
            displayErrorTooltips
            fast={true}
            formikProps={formikProps}
            disabled={disabled || readOnly}
            type="number"
            field={withNameSpace('squareFootage')}
            postText="Sq. Ft"
          />
        </Row>
        <Row>
          <Label required>Net Rentable Area</Label>
          <InputGroup
            displayErrorTooltips
            fast={true}
            formikProps={formikProps}
            disabled={disabled || readOnly}
            type="number"
            field={withNameSpace('rentableArea')}
            postText="Sq. Ft"
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
        <Row>
          <Label required>Type of Current Occupant</Label>
          <FastSelect
            formikProps={formikProps}
            className="type-occupant"
            disabled={disabled || readOnly}
            placeholder="Must Select One"
            field={withNameSpace('buildingOccupantTypeId')}
            type="number"
            options={occupantTypes}
          />
        </Row>
        <Row>
          <Label>Occupant Name</Label>
          <FastInput
            displayErrorTooltips
            className="type-occupant"
            formikProps={formikProps}
            disabled={disabled || readOnly}
            field={withNameSpace('occupantName')}
          />
        </Row>
        <Row style={{ display: 'flex' }}>
          <Label>Lease Expiry Date</Label>
          <FastDatePicker
            formikProps={formikProps}
            disabled={disabled || readOnly}
            field={withNameSpace('leaseExpiry')}
          />
          <Check
            postLabel="Transfer Lease with Land"
            disabled={disabled || readOnly}
            field={withNameSpace('transferLeaseOnSale')}
          />
        </Row>
      </InfoSection>
    </Col>
  );
};
