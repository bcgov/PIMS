import React, { memo, useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import { FormikProps, getIn, ErrorMessage } from 'formik';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { formikFieldMemo, isPositiveNumberOrZero } from 'utils';
import classNames from 'classnames';
import { ColProps, Form } from 'react-bootstrap';
import TooltipIcon from '../TooltipIcon';
import './FastCurrencyInput.scss';
import { Col } from 'react-bootstrap';

export const defaultMaskOptions = {
  prefix: '$',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 0, // how many digits allowed after the decimal
  integerLimit: undefined, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

type RequiredAttributes = {
  /** The field name */
  field: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};

type OptionalAttributes = {
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** The value to display, overrides formik values */
  value?: number | '';
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
  /** Whether the field is required. Makes the field border blue. */
  required?: boolean;
  /** Whether negative numbers are allowed. */
  allowNegative?: boolean;
  /** Suppress validation on submit */
  suppressValidation?: boolean;
};

export type CurrencyInputProps = RequiredAttributes &
  OptionalAttributes & { placeholder?: string; tooltip?: string } & ColProps;

/**
 * Formik-wrapped currency input providing a numeric mask over number fields
 * without changing the formik prop value to string.
 */
const CurrencyInput = ({
  field,
  className,
  outerClassName,
  value,
  disabled,
  placeholder,
  tooltip,
  required,
  suppressValidation,
  formikProps: {
    handleBlur,
    values,
    setFieldValue,
    errors,
    touched,
    registerField,
    unregisterField,
    isSubmitting,
  },
  ...rest
}: CurrencyInputProps) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    allowNegative: rest.allowNegative,
  });
  value = value ? value : getIn(values, field);
  const error = getIn(errors, field);
  let touch = getIn(touched, field);
  if (isSubmitting && suppressValidation) {
    touch = false;
  }

  if (!rest.allowNegative && !isPositiveNumberOrZero(value)) {
    value = '';
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
    <Form.Group
      className={classNames(!!required ? 'required' : '', outerClassName)}
      as={Col}
      md={rest.md}
    >
      <div className="input-tooltip-wrapper">
        <MaskedInput
          value={value}
          mask={currencyMask}
          name={field}
          onChange={(e: any) => {
            const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
            setFieldValue(field, cleanValue ? parseFloat(cleanValue) : '');
          }}
          onBlur={handleBlur}
          className={classNames('form-control input-number', className, isInvalid, isValid)}
          disabled={disabled}
          required={required}
          placeholder={placeholder || ''}
        />
        {!!tooltip && <TooltipIcon toolTipId="currency" toolTip={tooltip} />}

        <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
      </div>
    </Form.Group>
  );
};

/**
 * FastCurrencyInput component provides a Formik input that only accepts financial values.
 */
export const FastCurrencyInput = memo(
  CurrencyInput,
  (prevProps: any, currentProps: any) =>
    prevProps.value === currentProps.value && formikFieldMemo(prevProps, currentProps),
);
