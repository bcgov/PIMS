import { FunctionComponent, useCallback } from 'react';
import React from 'react';
import { Input, Form } from 'components/common/form';
// import { PidTooltip, PinTooltip } from '../strings';
import { useFormikContext, getIn } from 'formik';
import { IParcel } from 'actions/parcelsActions';
import debounce from 'lodash/debounce';

interface PidPinProps {
  handlePidChange: (pid: string) => void;
  handlePinChange: (pin: string) => void;
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
export const pidFormatter = (pid: string) => {
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
  const { touched } = useFormikContext<IParcel>();

  const debouncedHandlePidChange = useCallback(
    debounce((pid: string) => {
      props.handlePidChange(pid);
    }, 100),
    [],
  );

  return (
    <>
      <Form.Row className="d-inline-flex flex-nowrap">
        <Form.Label>
          <span className="req">*</span>PID
        </Form.Label>
        <Input
          displayErrorTooltips
          className="input-small"
          // tooltip={PidTooltip}
          disabled={props.disabled}
          pattern={RegExp(/^[\d\- ]*$/)}
          onBlurFormatter={(pid: string) => {
            if (pid && getIn(touched, withNameSpace('pid'))) {
              debouncedHandlePidChange(pid);
            }
            return pid.replace(pid, pidFormatter(pid));
          }}
          field={withNameSpace('pid')}
        />
        <Form.Label>PIN</Form.Label>
        <Input
          displayErrorTooltips
          className="input-small"
          // tooltip={PinTooltip}
          disabled={props.disabled}
          field={withNameSpace('pin')}
          onBlurFormatter={(pin: string) => {
            if (pin && getIn(touched, withNameSpace('pin'))) {
              props.handlePinChange(pin);
            }
            return pin;
          }}
          type="number"
        />
      </Form.Row>
    </>
  );
};

export default PidPinForm;
