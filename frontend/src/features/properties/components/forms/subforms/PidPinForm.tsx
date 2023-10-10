import './PidPinForm.scss';

import classNames from 'classnames';
import { Input } from 'components/common/form';
import { Label } from 'components/common/Label';
import { FunctionComponent } from 'react';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { PidPinTooltip } from '../strings';

interface PidPinProps {
  handlePidChange: (pid: string, nameSpace?: string) => void;
  handlePinChange: (pin: string, nameSpace?: string) => void;
  nameSpace?: string;
  disabled?: boolean;
}
export const defaultPidPinFormValues: {
  pid: string;
  pin: number | '';
} = {
  pid: '',
  pin: '',
};

/**
 * The pidFormatter is used to format the specified PID value
 * @param {string} pid This is the target PID to be formatted
 */
export const pidFormatter = (pid: string) => {
  pid = pid.padStart(9, '0');
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

  return (
    <Row className={classNames('align-items-center', 'pid-pin-form')}>
      <Col xs={2} className="left-column">
        <Label>PID</Label>
      </Col>
      <Col xs={4}>
        <Input
          required={true}
          displayErrorTooltips
          className="input-small"
          disabled={props.disabled}
          pattern={RegExp(/^[\d\- ]*$/)}
          onBlurFormatter={(pid: string) => {
            if (pid?.length > 0) {
              return pid.replace(pid, pidFormatter(pid));
            }
            return '';
          }}
          field={withNameSpace('pid')}
        />
      </Col>
      <Col xs={2} className={classNames('left-column', 'pin-column')}>
        <Label>PIN</Label>
      </Col>
      <Col xs={3} className="no-padding">
        <Input
          required={true}
          displayErrorTooltips
          className="input-small"
          tooltip={PidPinTooltip}
          disabled={props.disabled}
          field={withNameSpace('pin')}
          onBlurFormatter={(pin: number) => {
            if (pin > 0) {
              return pin;
            }
            return '';
          }}
          type="number"
        />
      </Col>
    </Row>
  );
};

export default PidPinForm;
