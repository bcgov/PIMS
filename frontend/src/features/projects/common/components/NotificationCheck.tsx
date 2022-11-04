import { Check, Form } from 'components/common/form';
import * as React from 'react';

export interface INotificationCheckProps {
  label?: string;
  field: string;
  checkedState?: boolean;
  setCheckedState?: Function;
}

export default function NotificationCheck({
  label,
  field,
  checkedState,
  setCheckedState,
}: INotificationCheckProps) {
  return (
    <>
      <Form.Group>
        <h3>Notifications</h3>
      </Form.Group>
      <Form.Group>
        <Check
          postLabel={label}
          field={field}
          setCheckedState={setCheckedState}
          checkedState={checkedState}
        />
      </Form.Group>
    </>
  );
}
