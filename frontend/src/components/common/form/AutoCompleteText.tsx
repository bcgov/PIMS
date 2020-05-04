import './AutoCompleteText.scss';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { DisplayError } from './DisplayError';
import { useFormikContext } from 'formik';

export const AutoCompleteText: React.FC<any> = ({ field, options, placeholder }) => {
  let items: any[] = [];

  const { setFieldValue, handleChange } = useFormikContext<any>();

  options.forEach((option: { label: any; value: any }) => {
    items.push(option);
  });

  const [suggestions, setSuggestions] = useState<any>([]);
  const [text, setText] = useState<any>('');

  const onTextChanged = (e: any) => {
    const val = e.target.value;
    let dynamicSuggestions: any[] = [];
    if (val.length > 0) {
      const regex = new RegExp(`${val}`, 'i');
      dynamicSuggestions = items.filter(v => regex.test(v.label));
    }
    setSuggestions(dynamicSuggestions);
    setText(val);
    handleChange(e);
  };

  const suggestionSelected = (val: any) => {
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
