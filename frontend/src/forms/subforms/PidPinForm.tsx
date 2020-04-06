import { FunctionComponent, Fragment } from 'react';
import React from 'react';
import { Input, Form } from 'components/common/form';
import { Col } from 'react-bootstrap';

interface PidPinProps {
  nameSpace?: string;
}
export const defaultPidPinFormValues = {
  pid: '',
  pin: '',
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
            PID
          </Form.Label>
          <Input className="col-md-10" field={withNameSpace('pid')} />
        </Form.Row>
        <p style={{ textAlign: 'center' }}>OR</p>
        <Form.Row>
          <Form.Label column md={2}>
            PIN
          </Form.Label>
          <Input className="col-md-10" field={withNameSpace('pin')} />
        </Form.Row>
      </Col>
    </Fragment>
  );
};

export default PidPinForm;
