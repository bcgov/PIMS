import { FunctionComponent } from 'react';
import React from 'react';
import { Input, Form } from 'components/common/form';
import { PidTooltip, PinTooltip } from '../strings';

interface PidPinProps {
  nameSpace?: string;
  disabled?: boolean;
}
export const defaultPidPinFormValues: {
  pid: number | '';
  pin: number | '';
} = {
  pid: '',
  pin: '',
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

  return (
    <>
      <Form.Row className="d-inline-flex flex-nowrap">
        <Form.Label className="required">PID</Form.Label>
        <Input
          displayErrorTooltips
          className="input-small"
          tooltip={PidTooltip}
          disabled={props.disabled}
          pattern={RegExp(/^[\d\- ]*$/)}
          onBlurFormatter={(pid: string) => pid.replace(pid, pidFormatter(pid))}
          field={withNameSpace('pid')}
        />
        <Form.Label style={{ width: '35px', minWidth: '35px', paddingLeft: '5px' }}>
          or
          <br />
          PIN&nbsp;
        </Form.Label>
        <Input
          displayErrorTooltips
          className="input-small"
          tooltip={PinTooltip}
          disabled={props.disabled}
          field={withNameSpace('pin')}
          type="number"
        />
      </Form.Row>
    </>
  );
};

export default PidPinForm;
