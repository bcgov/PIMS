import * as React from 'react';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import './GeocoderAutoComplete.scss';
import { Form, FormControlProps } from 'react-bootstrap';
import { DisplayError } from 'components/common/form';
import ClickAwayListener from 'react-click-away-listener';
import { debounce } from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface IGeocoderAutoCompleteProps {
  field: string;
  placeholder?: string;
  disabled?: boolean;
  autoSetting?: string;
  required?: boolean;
  debounceTimeout?: number;
  value?: string;
  onSelectionChanged?: (data: IGeocoderResponse) => void;
  error?: any;
  touch?: any;
  onTextChange?: (value?: string) => void;
  tooltip?: string;
  displayErrorTooltips?: boolean;
}

export const GeocoderAutoComplete: React.FC<IGeocoderAutoCompleteProps> = ({
  field,
  placeholder,
  disabled,
  autoSetting,
  required,
  onSelectionChanged,
  debounceTimeout,
  value,
  touch,
  error,
  onTextChange,
  tooltip,
  displayErrorTooltips,
  ...rest
}) => {
  const [options, setOptions] = React.useState<IGeocoderResponse[]>([]);
  const api = useApi();
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;

  const search = debounce(async (val: string) => {
    const data = await api.searchAddress(val);
    setOptions(data);
  }, debounceTimeout || 500);

  const onTextChanged = async (val?: string) => {
    onTextChange && onTextChange(val);
    if (val && val.length >= 5 && val !== value) {
      search(val);
    } else {
      setOptions([]);
    }
  };

  const suggestionSelected = (val: IGeocoderResponse) => {
    setOptions([]);
    if (onSelectionChanged) {
      val.fullAddress = (val.fullAddress || '').split(',')[0];
      onSelectionChanged(val);
    }
  };

  const renderSuggestions = () => {
    if (options !== undefined && options.length === 0) {
      return null;
    }
    if (options !== undefined) {
      return (
        <div className="suggestionList">
          {options.map((x: IGeocoderResponse, index: number) => (
            <option key={index} onClick={() => suggestionSelected(x)}>
              {x.fullAddress}
            </option>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="GeocoderAutoComplete">
      <ClickAwayListener onClickAway={() => setOptions([])}>
        <Form.Group controlId={`input-${field}`}>
          {!!tooltip && <TooltipIcon toolTipId={`${field}-tooltip`} toolTip={tooltip} />}
          <TooltipWrapper toolTipId={`${field}-error-tooltip}`} toolTip={errorTooltip}>
            <InputControl
              autoComplete={autoSetting}
              field={field}
              value={value}
              isInvalid={!!touch && !!error}
              onTextChange={onTextChanged}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              {...rest}
            />
          </TooltipWrapper>
          {renderSuggestions()}
          <DisplayError field={field} />
        </Form.Group>
      </ClickAwayListener>
    </div>
  );
};

interface IDebounceInputProps extends FormControlProps {
  field: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
  onTextChange: (value?: string) => void;
}

const InputControl: React.FC<IDebounceInputProps> = ({ onTextChange, ...props }) => {
  const onChange = (value: string) => {
    onTextChange(value);
  };

  return (
    <Form.Control
      autoComplete={props.autoComplete}
      name={props.field}
      value={props.value}
      isInvalid={props.isInvalid}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      }}
      placeholder={props.placeholder}
      disabled={props.disabled}
      required={props.required}
      {...props}
    />
  );
};
