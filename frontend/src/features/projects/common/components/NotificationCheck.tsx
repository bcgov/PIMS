import { Check, Form } from 'components/common/form';
import * as React from 'react';

export interface INotificationCheckProps {
  label?: string;
  field: string;
}

export default function NotificationCheck({ label, field }: INotificationCheckProps) {
  return (
    <>
      <Form.Row>
        <h3>Notifications</h3>
      </Form.Row>
      <Form.Row>
        <Check postLabel={label} field={field} />
      </Form.Row>
    </>
  );
}
