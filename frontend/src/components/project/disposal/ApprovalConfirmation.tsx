import * as React from 'react';
import { Form } from 'react-bootstrap';
import { Field } from 'formik';

export type OnChangeType = (checked: boolean) => void;

interface IApprovalConfirmationProps {
  onChange?: OnChangeType;
  field: string;
  checked?: boolean;
  userDisplayName: string;
}

/**
 * A component for displaying an approval confirmation checkbox
 * @component
 * @example
 * const onChange = (checked) => console.log('confirmed');
 * const userDisplayName = 'PIMS User';
 * const fieldName = 'confirmation';
 * return (
 *
 * <Formik initialValues={{[fieldName]: false}}>
 *    <Form>
 *        <ApprovalConfirmationCheckbox field={fieldName} onChange={onChange} userDisplayName={userDisplayName} />
 *    </Form>
 * </Formik>
 * );
 */
export const ApprovalConfirmationCheckbox: React.FC<IApprovalConfirmationProps> = ({
  userDisplayName,
  field,
  onChange,
}) => {
  const label = `I, ${userDisplayName}, confirm by checking this box that I have received the approval 
    to request the property be submitted to the Enhanced Referral Program and marketed internally to other Ministry 
    and Broader Public Sector Agencies for 90 days before listing the property to be sold on the public commercial real estate market`;
  return (
    <Form.Group controlId="approval-confirmation">
      <Field
        name={field}
        type="checkbox"
        label={label}
        onChange={(event: any) => onChange && onChange(event.target.value)}
      />
    </Form.Group>
  );
};
