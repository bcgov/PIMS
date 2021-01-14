import React, { CSSProperties, memo, useEffect } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { getIn, FormikProps } from 'formik';
import { DisplayError } from './DisplayError';
import { SelectOption } from './Select';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';
import TooltipIcon from 'components/common/TooltipIcon';
import TooltipWrapper from '../TooltipWrapper';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /**  Array in the shape of [ { value: string or number, label: string } ] */
  options: SelectOption[];
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
  /** Class name of the input wrapper */
  outerClassName?: string;
};

type OptionalAttributes = {
  /** The label used above the input element. */
  label?: string;
  /** Names of the labels so the component knows what to filter by */
  limitLabels?: string[];
  /** The underlying HTML element to use when rendering the FormControl */
  as?: React.ElementType;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** A custom class to add to the input element of the <Select> component */
  className?: string;
  /** Whether the field is required. Makes the field border blue. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Specifies that multiple options can be selected at once */
  multiple?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** force formik errors to display even if this field hasn't been touched */
  errorPrompt?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** add style to the select input */
  style?: CSSProperties;
  /** Display errors in a tooltip instead of in a div */
  displayErrorTooltips?: boolean;
};

// only "field" and "options" are required for <Select>, the rest are optional
export type FastSelectProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Select> form control. Uses memo and cleanup inspired by
 * https://jaredpalmer.com/formik/docs/api/fastfield
 */
export const FastSelect: React.FC<FastSelectProps> = memo(
  ({
    field,
    label,
    as: is, // `as` is reserved in typescript
    placeholder,
    options,
    className,
    required,
    limitLabels,
    disabled,
    multiple,
    outerClassName,
    custom,
    type,
    errorPrompt,
    tooltip,
    displayErrorTooltips,
    style,
    formikProps: {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldTouched,
      registerField,
      unregisterField,
    },
    ...rest
  }) => {
    const error = getIn(errors, field);
    const touch = getIn(touched, field);
    const value = getIn(values, field);
    const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;
    const asElement: any = is || 'select';

    const handleMultipleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.selectedOptions;
      setFieldValue(
        field,
        [].slice.call(selected).map((option: HTMLOptionElement & number) => option.value),
      );
    };

    const Placeholder = () => {
      if (!placeholder) {
        return null;
      }
      return <option value="">{`${placeholder}`}</option>;
    };

    const PreviousValue = () => {
      let prevLabel;
      if (!limitLabels) {
        return null;
      }
      options.forEach((x: any) => {
        if (x.value === value?.toString()) {
          prevLabel = x.label;
        }
      });
      return (
        <option key={value} value={value} hidden>
          {prevLabel}
        </option>
      );
    };

    const limitedOptions = options.filter((x: any) => limitLabels?.includes(x?.label));

    const renderOptions = () => {
      if (!limitLabels) {
        return options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ));
      } else {
        return limitedOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ));
      }
    };

    useEffect(() => {
      registerField(field, { validate: undefined });
      return () => {
        unregisterField(field);
      };
    }, [field, registerField, unregisterField]);
    return (
      <Form.Group
        controlId={`input-${field}-fast`}
        className={classNames(!!required ? 'required' : '', outerClassName)}
      >
        {!!label && <Form.Label>{label}</Form.Label>}
        {!!tooltip && <TooltipIcon toolTipId="fastSelect-tip" toolTip={tooltip} />}
        <TooltipWrapper toolTipId={`${field}-error-tooltip}`} toolTip={errorTooltip}>
          <Form.Control
            as={asElement}
            name={field}
            className={className}
            required={required}
            disabled={disabled}
            style={style}
            custom={custom}
            isInvalid={!!touch && !!error}
            isValid={false}
            value={getIn(values, field)}
            multiple={multiple}
            onBlur={handleBlur}
            onChange={
              multiple
                ? handleMultipleChange
                : (e: any) => {
                    let value = e.currentTarget.value;
                    if (type === 'number' && !isNaN(parseInt(value))) {
                      value = parseInt(value);
                    }
                    setFieldValue(field, value);
                  }
            }
            type={type}
            {...rest}
          >
            <Placeholder />
            <PreviousValue />
            {renderOptions()}
          </Form.Control>
        </TooltipWrapper>
        {!displayErrorTooltips && <DisplayError field={field} />}
      </Form.Group>
    );
  },
  formikFieldMemo,
);
