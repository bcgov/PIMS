import './GeocoderAutoComplete.scss';

import classNames from 'classnames';
import { DisplayError } from 'components/common/form';
import TooltipIcon from 'components/common/TooltipIcon';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { useFormikContext } from 'formik';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { useCallback } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';

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
  /** class to apply to entire form group */
  outerClassName?: string;
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
  outerClassName,
  ...rest
}) => {
  const [options, setOptions] = React.useState<IGeocoderResponse[]>([]);
  const api = useApi();
  const { handleBlur } = useFormikContext<any>();
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;

  const search = useCallback(
    (val: string, abort: boolean) =>
      debounce(async (val: string, abort: boolean) => {
        if (!abort) {
          const data = await api.searchAddress(val);
          setOptions(data);
        }
      }, debounceTimeout || 500)(val, abort),
    [api, debounceTimeout],
  );

  const onTextChanged = async (val?: string) => {
    onTextChange && onTextChange(val);
    if (val && val.length >= 5 && val !== value) {
      await search(val, false);
    } else {
      setOptions([]);
    }
  };
  React.useEffect(() => {
    return () => {
      search('', true);
    };
  }, [search]);

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
        <Form.Group
          controlId={`input-${field}`}
          className={classNames(!!required ? 'required' : '', outerClassName)}
        >
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
              onBlur={handleBlur}
              {...rest}
            />
          </TooltipWrapper>
          {!!tooltip && <TooltipIcon toolTipId={`${field}-tooltip`} toolTip={tooltip} />}
          {renderSuggestions()}
          {!errorTooltip && <DisplayError field={field} />}
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
  onBlur: {
    (e: React.FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
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
