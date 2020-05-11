import './AutoCompleteText.scss';

import React from 'react';
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
  textVal?: string;
  autoSetting?: string;
  required?: boolean;
};

export const AutoCompleteText: React.FC<IAutoCompleteProps> = ({
  field,
  options,
  placeholder,
  disabled,
  textVal,
  autoSetting,
  required,
}) => {
  const { setFieldValue, handleChange, errors, touched } = useFormikContext<any>();
  const [suggestions, setSuggestions] = useState<SelectOptions>([]);
  const [text, setText] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);

  const error = getIn(errors, field);
  const touch = getIn(touched, field);

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let dynamicSuggestions: SelectOptions = [];
    if (val.length > 0) {
      const regex = new RegExp(`${val}`, 'i');
      dynamicSuggestions = options.filter(v => regex.test(v.label));
    }
    setSuggestions(dynamicSuggestions);
    setText(val);
    handleChange(e);
  };

  const suggestionSelected = (val: SelectOption) => {
    setText(val.label);
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

  if (textVal !== undefined && loaded === false && textVal !== text) {
    setText(textVal);
    setLoaded(true);
  }

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
