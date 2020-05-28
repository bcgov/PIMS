import { FunctionComponent, Fragment } from 'react';
import React from 'react';
import { Input, Form } from 'components/common/form';
import { Col } from 'react-bootstrap';
import TooltipIcon from 'components/common/TooltipIcon';
import { PidTooltip, PinTooltip } from 'forms/strings';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';

interface PidPinProps {
  nameSpace?: string;
  disabled?: boolean;
}
export const defaultPidPinFormValues = {
  pid: '',
  pin: '',
  projectNumber: '',
};

/**
 * The pidFormatter is used to format the specified PID value
 * @param {string} pid This is the target PID to be formatted
 */
const pidFormatter = (pid: string) => {
  const regex = /(\d\d\d)[\s-]?(\d\d\d)[\s-]?(\d\d\d)/;
  const format = pid.match(regex);
  if (format !== null && format.length === 4) {
    pid = `${format[1]}-${format[2]}-${format[3]}`;
  }
  return pid;
};

const PidPinForm: FunctionComponent<PidPinProps> = (props: PidPinProps) => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };

  const keycloak = useKeycloakWrapper();

  const projectNumberDisabled = !keycloak.hasClaim(Claims.ADMIN_PROPERTIES);

  return (
    <Fragment>
      <Col className="pidPinForm" md={6}>
        <Form.Row>
          <Form.Label column md={2}>
            PID&nbsp;
            <TooltipIcon toolTipId="land-status" toolTip={PidTooltip} placement="right" />
          </Form.Label>
          <Input
            disabled={props.disabled}
            outerClassName="col-md-10"
            pattern={RegExp(/^[\d\- ]*$/)}
            onBlurFormatter={(pid: string) => pid.replace(pid, pidFormatter(pid))}
            field={withNameSpace('pid')}
          />
        </Form.Row>
        <p style={{ textAlign: 'center', height: '2.75rem' }}>OR</p>
        <Form.Row>
          <Form.Label column md={2}>
            PIN&nbsp;
            <TooltipIcon toolTipId="land-status" toolTip={PinTooltip} placement="right" />
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
            disabled={projectNumberDisabled}
            outerClassName="col-md-10"
            field={withNameSpace('projectNumber')}
          />
        </Form.Row>
      </Col>
    </Fragment>
  );
};

export default PidPinForm;
