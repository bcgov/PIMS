import React, { FunctionComponent } from 'react';
import { useField, useFormikContext, ErrorMessage, getIn } from 'formik';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FormGroup } from 'react-bootstrap';

export const FormikDatePicker: FunctionComponent<any> = ({ ...props }) => {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [field] = useField(props);
  const error = getIn(errors, field.name);
  const touch = getIn(touched, field.name);
  if (field.value === '') {
    field.value = undefined;
  }
  if (typeof field.value === 'string') {
    field.value = moment(field.value, 'YYYY-MM-DD').toDate();
  }
  const invalid = error && touch ? 'is-invalid' : '';
  return (
    <FormGroup>
      <span className={invalid}></span>
      <DatePicker
        {...field}
        {...props}
        className={'form-control ' + invalid}
        calendarIcon={null}
        dateFormat="MM/dd/yyyy"
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val: any) => {
          setFieldValue(
            field.name,
            moment(val)
              .add('day', 1)
              .format('YYYY-MM-DD'),
          );
        }}
      />
      <ErrorMessage component="div" className="invalid-feedback" name={field.name}></ErrorMessage>
    </FormGroup>
  );
};
