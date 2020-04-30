import { FunctionComponent, Fragment } from 'react';
import React from 'react';
import { Input, Form } from 'components/common/form';
import { Col } from 'react-bootstrap';
import TooltipIcon from 'components/common/TooltipIcon';

interface PidPinProps {
  nameSpace?: string;
  disabled?: boolean;
}
export const defaultPidPinFormValues = {
  pid: '',
  pin: '',
  projectNumber: '',
};
const PidPinForm: FunctionComponent<PidPinProps> = (props: PidPinProps) => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <Fragment>
      <Col className="pidPinForm" md={6}>
        <Form.Row>
          <Form.Label column md={2}>
            PID&nbsp;
            <TooltipIcon toolTipId="land-status" toolTip="placeholder" />
          </Form.Label>
          <Input
            disabled={props.disabled}
            outerClassName="col-md-10"
            field={withNameSpace('pid')}
          />
        </Form.Row>
        <p style={{ textAlign: 'center', height: '2.75rem' }}>OR</p>
        <Form.Row>
          <Form.Label column md={2}>
            PIN&nbsp;
            <TooltipIcon toolTipId="land-status" toolTip="placeholder" />
          </Form.Label>
          <Input
            disabled={props.disabled}
            outerClassName="col-md-10"
            field={withNameSpace('pin')}
            type="number"
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            RAEG or SPP
          </Form.Label>
          <Input
            disabled={true}
            outerClassName="col-md-10"
            field={withNameSpace('projectNumber')}
          />
        </Form.Row>
      </Col>
    </Fragment>
  );
};

export default PidPinForm;
