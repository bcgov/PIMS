import React, { memo, useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import { FormikProps, getIn, ErrorMessage } from 'formik';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { formikFieldMemo, isPositiveNumberOrZero } from 'utils';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';
import TooltipIcon from '../TooltipIcon';
import './FastCurrencyInput.scss';

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
};
/**
 * Formik-wrapped currency input providing a numeric mask over number fields
 * without changing the formik prop value to string.
 * @param param0
 */
const CurrencyInput = ({
  field,
  className,
  outerClassName,
  value,
  disabled,
  placeholder,
  tooltip,
  formikProps: {
    handleBlur,
    values,
    setFieldValue,
    errors,
    touched,
    registerField,
    unregisterField,
  },
}: RequiredAttributes & OptionalAttributes & { placeholder?: string; tooltip?: string }) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });
  value = value ? value : getIn(values, field);
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  if (!isPositiveNumberOrZero(value)) {
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
    <Form.Group className={classNames(outerClassName, 'fast-currency-input')}>
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
          className={classNames('form-control', className, isInvalid, isValid)}
          disabled={disabled}
          placeholder={placeholder || ''}
        />
        {!!tooltip && <TooltipIcon toolTipId="currency" toolTip={tooltip} />}

        <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
      </div>
    </Form.Group>
  );
};
export const FastCurrencyInput = memo(
  CurrencyInput,
  (prevProps: any, currentProps: any) =>
    prevProps.value === currentProps.value && formikFieldMemo(prevProps, currentProps),
);
