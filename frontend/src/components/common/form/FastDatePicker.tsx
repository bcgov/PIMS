import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { ErrorMessage, getIn, FormikProps } from 'formik';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import moment from 'moment';
import { FormGroup, FormControlProps } from 'react-bootstrap';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';
import GenericModal from '../GenericModal';
import { appraisalDateWarning } from 'features/projects/common';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};

type OptionalAttributes = {
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** The minimum data allowable to be chosen in the datepicker */
  minDate?: Date;
  /** warn the user if they select a date that is older then the current date */
  oldDateWarning?: boolean;
};

export type FastDatePickerProps = FormControlProps &
  RequiredAttributes &
  OptionalAttributes &
  Partial<ReactDatePickerProps>;

/**
 * Formik connected react-datepicker. Uses memo and cleanup inspired by
 * https://jaredpalmer.com/formik/docs/api/fastfield
 */
const FormikDatePicker: FunctionComponent<FastDatePickerProps> = ({
  field,
  disabled,
  outerClassName,
  minDate,
  oldDateWarning,
  formikProps: {
    values,
    initialValues,
    errors,
    touched,
    setFieldValue,
    registerField,
    unregisterField,
    setFieldTouched,
  },
  ...rest
}) => {
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const initialValue = getIn(initialValues, field);
  const [oldDate, setOldDate] = useState<string | undefined>(undefined);
  let value = getIn(values, field);
  if (value === '') {
    value = null;
  }
  if (typeof value === 'string') {
    value = moment(value, 'YYYY-MM-DD').toDate();
  }
  if (value && value !== initialValue) {
    setFieldTouched(field);
  }
  useEffect(() => {
    registerField(field, {});
    return () => {
      unregisterField(field);
    };
  }, [field, registerField, unregisterField]);
  const isInvalid = error && touch ? 'is-invalid ' : '';
  const isValid = !error && touch && value && !disabled ? 'is-valid ' : '';
  return (
    <FormGroup className={outerClassName ?? ''}>
      <span className={isInvalid}></span>
      <DatePicker
        autoComplete="off"
        name={field}
        placeholderText="--/--/----"
        className={classNames('form-control', 'date-picker', isInvalid, isValid)}
        dateFormat="MM/dd/yyyy"
        selected={(value && new Date(value)) || null}
        disabled={disabled}
        minDate={moment(minDate, 'YYYY-MM-DD').toDate()}
        {...rest}
        onBlur={() => setFieldTouched(field)}
        onCalendarClose={() => setFieldTouched(field)}
        onChange={(val: any, e) => {
          if (oldDateWarning && initialValue && moment(value).isAfter(moment(val))) {
            setOldDate(val);
          } else {
            setFieldValue(field, val ? moment(val).format('YYYY-MM-DD') : '');
          }
        }}
      />
      <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
      {!!oldDate && (
        <GenericModal
          display={!!oldDate}
          cancelButtonText={`Use ${moment(oldDate).format('MM/DD/YYYY')}`}
          okButtonText={`Use ${moment(value).format('MM/DD/YYYY')}`}
          handleOk={(e: any) => {
            setOldDate(undefined);
          }}
          handleCancel={() => {
            setFieldValue(field, moment(oldDate).format('YYYY-MM-DD'));
            setOldDate(undefined);
          }}
          title="Older Date Entered"
          message={appraisalDateWarning}
        />
      )}
    </FormGroup>
  );
};

export const FastDatePicker = memo(FormikDatePicker, formikFieldMemo);
