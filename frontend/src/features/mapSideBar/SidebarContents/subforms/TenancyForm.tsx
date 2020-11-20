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
  index,
  classifications,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  return (
    <Col className="tenancy">
      <Row>
        <h4>Tenancy</h4>
      </Row>
      <Row>
        <Label>Rentable Area</Label>
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
          disabled={disabled || readOnly}
          field={withNameSpace('buildingTenancy')}
        />
      </Row>
      <Row>
        <Label>Type of Current Occupant</Label>
        <FastSelect
          formikProps={formikProps}
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
          formikProps={formikProps}
          disabled={disabled || readOnly}
          field={withNameSpace('occupantName')}
        />
      </Row>
      <Row>
        <Label>Lease Expiry Date</Label>
        <FastDatePicker
          formikProps={formikProps}
          disabled={disabled || readOnly}
          field={withNameSpace('leaseExpiry')}
        />
      </Row>
      <Row>
        <Label></Label>
        <Check
          postLabel="Transfer Lease with Land"
          disabled={disabled || readOnly}
          field={withNameSpace('transferLeaseOnSale')}
        />
      </Row>
      {/* </Row> */}
      <Row className="classification">
        <Label>Classification</Label>
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
