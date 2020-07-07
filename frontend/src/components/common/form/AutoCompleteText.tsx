import './AutoCompleteText.scss';

import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { DisplayError } from './DisplayError';
import { useFormikContext, getIn } from 'formik';
import { SelectOption, SelectOptions } from './Select';

export type IAutoCompleteProps = {
  field: string;
  placeholder?: string;
  options: SelectOptions;
  disabled?: boolean;
  autoSetting?: string;
  required?: boolean;
  /** to determine whether to show the code or label defaults to label*/
  getValueDisplay?: (value: any) => string;
};

export const AutoCompleteText: React.FC<IAutoCompleteProps> = ({
  field,
  options,
  placeholder,
  disabled,
  autoSetting,
  required,
  getValueDisplay,
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [suggestions, setSuggestions] = useState<SelectOptions>([]);
  const [text, setText] = useState<string>('');

  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const value = getIn(values, field);

  useEffect(() => {
    if (value && options.length > 0) {
      const option = options.find(x => Number(x.value) === value);
      if (getValueDisplay && option) {
        setText(getValueDisplay(options.find(x => Number(x.value) === value)));
      } else {
        setText(option ? option.label : '');
      }
    }
  }, [value, setText, options, getValueDisplay, values, field]);

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let dynamicSuggestions: SelectOptions = [];
    if (val.length > 0) {
      const regex = new RegExp(`${val}`, 'i');
      dynamicSuggestions = options.filter(v => regex.test(v.label));
    }
    setSuggestions(dynamicSuggestions);
    setText(val);
  };

  const suggestionSelected = (val: SelectOption) => {
    setText(getValueDisplay ? getValueDisplay(val) : val.label);
    setSuggestions([]);
    setFieldValue(field, Number(val.value));
  };

  const renderSuggestions = () => {
    if (suggestions !== undefined && suggestions.length === 0) {
      return null;
    }
    if (suggestions !== undefined) {
      return (
        <div className="suggestionList">
          {suggestions.map((x: any) => (
            <option key={x.value} onClick={() => suggestionSelected(x)}>
              {x.label}
            </option>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // autoComplete will have different value depending on form. eg) 'new-password' is needed to override chrome's address suggestions etc.
    <div className="AutoCompleteText">
      <Form.Group controlId={`input-${field}`}>
        <Form.Control
          autoComplete={autoSetting}
          name={field}
          value={text}
          isInvalid={!!touch && !!error}
          onChange={onTextChanged}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        {renderSuggestions()}
        <DisplayError field={field} />
      </Form.Group>
    </div>
  );
};
