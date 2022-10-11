import './TenancyForm.scss';

import { FastDatePicker, FastInput, InputGroup } from 'components/common/form';
import { Label } from 'components/common/Label';
import TooltipIcon from 'components/common/TooltipIcon';
import { getIn } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
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
        <h4 className="text-start">Occupancy</h4>
      </Row>
      <InfoSection>
        <Form.Group as={Row}>
          <Label>Total Area</Label>
          <Col>
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
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-2">
          <Label>Net Usable Area</Label>
          <Col>
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
          </Col>
        </Form.Group>
      </InfoSection>
      <Row>
        <h4 className="text-start">Tenants</h4>
      </Row>
      <InfoSection>
        <Row>
          <Col xs={3}>
            <Label className="label-with-tooltip">Tenancy %</Label>
            <TooltipStyled
              toolTipId="tenancy-tooltip"
              toolTip="Enter the percentage that your Agency tenants this building.
            You may also write notes, for example: 90% my agency and 10% leased to the city."
              className="align-top"
            />
          </Col>
          <Col xs={4}>
            <FastInput
              displayErrorTooltips
              formikProps={formikProps}
              className="percentage"
              disabled={disabled || readOnly}
              field={withNameSpace('buildingTenancy')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Label>Updated On</Label>
          </Col>
          <Col xs={2}>
            <FastDatePicker
              formikProps={formikProps}
              disabled={disabled || readOnly}
              field={withNameSpace('buildingTenancyUpdatedOn')}
            />
          </Col>
        </Row>
      </InfoSection>
    </Col>
  );
};
