import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { ErrorMessage, getIn, FormikProps } from 'formik';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import moment from 'moment';
import { FormGroup, FormControlProps, Form } from 'react-bootstrap';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';
import GenericModal from '../GenericModal';
import { appraisalDateWarning } from 'features/projects/common';
import * as Popper from 'popper.js';
import dequal from 'dequal';

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
  /** form label */
  label?: string;
  /** Whether the field is required. Makes the field border blue. */
  required?: boolean;
  /** optional popper modifiers to pass to the datepicker */
  popperModifiers?: Popper.Modifiers | undefined;
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
  label,
  required,
  popperModifiers,
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
  if (value && dequal(moment(initialValue, 'YYYY-MM-DD'), moment(value, 'YYYY-MM-DD'))) {
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
    <FormGroup
      className={classNames(!!required ? 'required' : '', outerClassName)}
      controlId={`datepicker-${field}`}
    >
      {!!label && <Form.Label>{label}</Form.Label>}

      <DatePicker
        id={`datepicker-${field}`}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={10}
        autoComplete="off"
        name={field}
        required={required}
        placeholderText="--/--/----"
        className={classNames('form-control', 'date-picker', isInvalid, isValid)}
        dateFormat="MM/dd/yyyy"
        selected={(value && new Date(value)) || null}
        disabled={disabled}
        minDate={minDate ? moment(minDate, 'YYYY-MM-DD').toDate() : undefined}
        {...rest}
        popperModifiers={popperModifiers}
        onBlur={() => {
          if (oldDateWarning && initialValue && moment(initialValue).isAfter(moment(value))) {
            setOldDate(value);
          }
          setFieldTouched(field);
        }}
        onCalendarClose={() => {
          if (oldDateWarning && initialValue && moment(initialValue).isAfter(moment(value))) {
            setOldDate(value);
          }
          setFieldTouched(field);
        }}
        onChange={(val: any, e) => {
          setFieldValue(field, val ? moment(val).format('YYYY-MM-DD') : '');
        }}
      />
      <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
      {!!oldDate && (
        <GenericModal
          display={!!oldDate}
          cancelButtonText={`Use ${moment(oldDate).format('MM/DD/YYYY')}`}
          okButtonText={`Use ${moment(initialValue).format('MM/DD/YYYY')}`}
          handleOk={(e: any) => {
            setFieldValue(field, moment(initialValue).format('YYYY-MM-DD'));
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
