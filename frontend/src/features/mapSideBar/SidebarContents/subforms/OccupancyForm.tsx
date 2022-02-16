import './TenancyForm.scss';

import { FastDatePicker, FastInput, InputGroup } from 'components/common/form';
import { Label } from 'components/common/Label';
import TooltipIcon from 'components/common/TooltipIcon';
import { getIn } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

interface IOccupancyProps {
  formikProps: any;
  disabled?: boolean;
  readOnly?: boolean;
  nameSpace?: string;
  index?: any;
}

const InfoSection = styled.div`
  margin-left: 20px;
  margin-bottom: 20px;
  .label-with-tooltip {
    margin-right: 5px;
  }
`;

const TooltipStyled = styled(TooltipIcon)`
  margin-top: 0.3rem;
  margin-right: 10px;
`;

export const OccupancyForm: React.FC<IOccupancyProps> = ({
  formikProps,
  disabled,
  readOnly,
  nameSpace,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', name].filter((x) => x).join('.');
    },
    [nameSpace],
  );
  const { touched, values, setFieldValue } = formikProps;

  //if the building tenancy is modified, automatically update the buildingTenancyUpdatedOn.
  const buildingTenancyTouched = getIn(touched, withNameSpace('buildingTenancy'));
  const buildingTenancy = getIn(values, withNameSpace('buildingTenancy'));
  useEffect(() => {
    if (buildingTenancyTouched && buildingTenancy) {
      setFieldValue(
        withNameSpace('buildingTenancyUpdatedOn'),
        moment(new Date()).format('YYYY-MM-DD'),
      );
    }
  }, [buildingTenancy, buildingTenancyTouched, setFieldValue, withNameSpace]);

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
            field={withNameSpace('totalArea')}
            postText="Sq. M"
            required
          />
        </Row>
        <Row>
          <Label>Net Usable Area</Label>
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
          <Label className="label-with-tooltip">Tenancy %</Label>
          <TooltipStyled
            toolTipId="tenancy-tooltip"
            toolTip="Enter the percentage that your Agency tenants this building.
            You may also write notes, for example: 90% my agency and 10% leased to the city."
          />
          <FastInput
            displayErrorTooltips
            formikProps={formikProps}
            className="percentage"
            disabled={disabled || readOnly}
            field={withNameSpace('buildingTenancy')}
          />
          <Label>Updated On</Label>
          <FastDatePicker
            formikProps={formikProps}
            disabled={disabled || readOnly}
            field={withNameSpace('buildingTenancyUpdatedOn')}
          />
        </Row>
      </InfoSection>
    </Col>
  );
};
