import React, { FunctionComponent } from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-date-picker';

export const FormikDatePicker: FunctionComponent<any> = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      calendarIcon={null}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(val: any) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};
