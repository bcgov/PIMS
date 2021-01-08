import * as React from 'react';
import { Typeahead, TypeaheadModel, TypeaheadProps } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import { getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import TooltipIcon from 'components/common/TooltipIcon';
import classNames from 'classnames';
import { useRef } from 'react';

export interface ITypeaheadFieldProps<T extends TypeaheadModel> extends TypeaheadProps<T> {
  name: string;
  label?: string;
  required?: boolean;
  /** whether or not this component should show the validation checkmark */
  hideValidation?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** A function that takes in the value stored in formik and returns the corresponding label for that value. */
  getOptionByValue?: (value?: any) => T[];
  /** pass a custom onChange to the TypeaheadField */
  onChange?: (vals: any) => void;
  /** pass a custom selection to the TypeaheadField */
  selected?: any;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** clear menu on custom header click */
  clearMenu?: boolean;
  /** controlling the selected inputs for multiple select enabled queries */
  multiSelections?: any;
  /** used to trigger ref.current.blur where applicable */
  clearSelected?: boolean;
  /** restet clear  state via this component */
  setClear?: Function;
}

const Feedback = styled(Form.Control.Feedback)`
  display: block;
`;

export function TypeaheadField<T extends TypeaheadModel>({
  label,
  required,
  name,
  hideValidation,
  tooltip,
  getOptionByValue,
  multiSelections,
  onChange,
  setClear,
  selected,
  clearSelected,
  outerClassName,
  clearMenu,
  ...rest
}: ITypeaheadFieldProps<T>) {
  const { touched, values, errors, setFieldTouched, setFieldValue } = useFormikContext();
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);
  const isValid = !!getIn(touched, name) && !getIn(errors, name);
  if (!getOptionByValue) {
    getOptionByValue = (value: T) => (!!value ? ([value] as T[]) : ([] as T[]));
  }

  const ref = useRef<any>();
  React.useEffect(() => {
    if (clearSelected && ref.current?.clear) {
      ref.current.clear();
      setFieldValue(name, '');
      setClear && setClear(false);
    }
    if (clearMenu && ref.current?.blur) {
      ref.current.blur();
      setClear && setClear(false);
    }
  }, [clearMenu, clearSelected, setClear, name, setFieldValue]);
  return (
    <Form.Group className={classNames(!!required ? 'required' : '', outerClassName)}>
      {!!label && <Form.Label>{label}</Form.Label>}
      {!!tooltip && <TooltipIcon toolTipId="typeAhead-tip" toolTip={tooltip} />}
      <Typeahead<T>
        {...rest}
        inputProps={{ ...rest.inputProps, name: name, id: `${name}-field` }}
        isInvalid={hasError as any}
        isValid={!hideValidation && isValid}
        selected={
          multiSelections?.length > 0 ? multiSelections : getOptionByValue(getIn(values, name))
        }
        ref={ref}
        onChange={
          onChange
            ? onChange
            : (newValues: T[]) => {
                setFieldValue(name, getIn(newValues[0], 'value') ?? newValues[0]);
              }
        }
        onBlur={() => setFieldTouched(name, true)}
        id={`${name}-field`}
      />
      {hasError && <Feedback type="invalid">{getIn(errors, name)}</Feedback>}
    </Form.Group>
  );
}
