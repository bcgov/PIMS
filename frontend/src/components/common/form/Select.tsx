import './Select.scss';

import classNames from 'classnames';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { Col, Form, FormControlProps, Row } from 'react-bootstrap';

import { DisplayError } from './DisplayError';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /**  Array in the shape of [ { value: string or number, label: string } ] */
  options: SelectOption[];
};

type OptionalAttributes = {
  /** The label used above the input element. */
  label?: string;
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
  /** change event handler */
  onChange?: React.FormEventHandler;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** input "type" ie. string, number */
  customStyles?: React.CSSProperties;
};

// only "field" and "options" are required for <Select>, the rest are optional
export type SelectProps = FormControlProps & OptionalAttributes & RequiredAttributes;

export type SelectOption = {
  label: string;
  value: string | number;
  selected?: boolean;
  code?: string;
  parentId?: string | number;
  parent?: string;
};

export type SelectOptions = SelectOption[];

/**
 * Formik-connected <Select> form control
 */
export const Select: React.FC<SelectProps> = ({
  field,
  label,
  as: is, // `as` is reserved in typescript
  placeholder,
  options,
  className,
  required,
  disabled,
  multiple,
  custom,
  onChange,
  type,
  outerClassName,
  customStyles,
  ...rest
}) => {
  const { values, handleBlur, handleChange, setFieldValue, errors, touched } = useFormikContext();
  const value = getIn(values, field);
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const asElement: any = is || 'select';

  const handleMultipleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.selectedOptions;
    setFieldValue(
      field,
      [].slice.call(selected).map((option: HTMLOptionElement & number) => option.value),
    );
  };

  const onSelectChange = (e: any) => {
    const updateFormValues = multiple ? handleMultipleChange : handleChange;
    updateFormValues(e);
    onChange?.(e);
  };

  const renderPlaceholder = () => {
    if (!placeholder) {
      return null;
    }
    return <option value="">{`${placeholder}`}</option>;
  };

  const renderOptions = () => {
    return options.map((option) => (
      <option key={option.value} value={option.value} className="option">
        {option.label}
      </option>
    ));
  };

  return (
    <Row
      controlid={`input-${field}`}
      className={classNames(!!required ? 'required' : '', outerClassName, 'select-row')}
    >
      {!!label && (
        <Col md="auto">
          <Form.Label>{label}</Form.Label>
        </Col>
      )}
      <Col md="auto" className="select-column">
        <Form.Control
          style={customStyles}
          as={asElement}
          name={field}
          className={classNames(className, 'form-select')}
          required={required}
          disabled={disabled}
          custom={custom}
          isInvalid={!!touch && !!error}
          {...rest}
          value={getIn(values, field)}
          multiple={multiple}
          onChange={onSelectChange}
          onBlur={(e: any) => {
            if (type === 'number' && multiple) {
              setFieldValue(
                field,
                value.map((x: any) => +x),
              );
            } else if (type === 'number' && !isNaN(parseInt(value))) {
              setFieldValue(field, parseInt(value));
            }
            handleBlur(e);
          }}
        >
          {renderPlaceholder()}
          {renderOptions()}
        </Form.Control>
      </Col>
      <DisplayError field={field} />
    </Row>
  );
};
