import React from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { DisplayError } from './DisplayError';
import classNames from 'classnames';
import './Select.scss';

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
  /** Makes the input element required. */
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

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updateFormValues = multiple ? handleMultipleChange : handleChange;
    updateFormValues(e);
    onChange?.(e);
  };

  const renderPlaceholder = () => {
    if (!placeholder) {
      return null;
    }
    return <option value="">{`${placeholder}${!label && required ? ' *' : ''}`}</option>;
  };

  const renderOptions = () => {
    return options.map(option => (
      <option key={option.value} value={option.value} className="option">
        {option.label}
      </option>
    ));
  };

  return (
    <Form.Group
      controlId={`input-${field}`}
      className={classNames(!!required ? 'required' : '', outerClassName)}
    >
      {!!label && <Form.Label>{label}</Form.Label>}
      {!!required && <span className="required">*</span>}
      <Form.Control
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
      <DisplayError field={field} />
    </Form.Group>
  );
};
