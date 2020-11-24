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

interface ITenancyProps {
  formikProps: any;
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
  index?: any;
  occupantTypes: SelectOptions;
  classifications: SelectOptions;
}

export const TenancyForm: React.FC<ITenancyProps> = ({
  formikProps,
  disabled,
  readOnly,
  occupantTypes,
  nameSpace,
  classifications,
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
        <h4>Tenancy</h4>
      </Row>
      <Row>
        <Label required>Rentable Area</Label>
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
      <Row className="classification">
        <Label required>Classification</Label>
        <FastSelect
          formikProps={formikProps}
          type="number"
          placeholder="Must Select One"
          field={withNameSpace('classificationId')}
          options={classifications}
        />
      </Row>
    </Col>
  );
};
