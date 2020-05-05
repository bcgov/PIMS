import './AutoCompleteText.scss';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { DisplayError } from './DisplayError';
import { useFormikContext } from 'formik';
import { SelectOption, SelectOptions } from './Select';

export type IAutoCompleteProps = {
  field: string;
  placeholder?: string;
  options: SelectOptions;
};

export const AutoCompleteText: React.FC<IAutoCompleteProps> = ({ field, options, placeholder }) => {
  const { setFieldValue, handleChange } = useFormikContext<any>();

  const [suggestions, setSuggestions] = useState<SelectOptions>([]);
  const [text, setText] = useState<string>('');

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
    setFieldValue(field, val.value);
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
    <div className="AutoCompleteText">
      <Form.Group controlId={`input-${field}`}>
        <Form.Control
          autoComplete="off"
          name={field}
          value={text}
          onChange={onTextChanged}
          placeholder={placeholder}
        />
        {renderSuggestions()}
        <DisplayError field={field} />
      </Form.Group>
    </div>
  );
};
