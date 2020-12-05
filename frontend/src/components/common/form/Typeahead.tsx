import * as React from 'react';
import { Typeahead, TypeaheadModel, TypeaheadProps } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import { getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import TooltipIcon from 'components/common/TooltipIcon';
import { useRef } from 'react';
import TooltipWrapper from '../TooltipWrapper';
import classNames from 'classnames';

interface ITypeaheadFieldProps<T extends TypeaheadModel> extends TypeaheadProps<T> {
  name: string;
  label?: string;
  required?: boolean;
  /** whether or not this component should show the validation checkmark */
  hideValidation?: boolean;
  /**Tooltip text */
  tooltip?: string;
  /** A function that takes in the value stored in formik and returns the corresponding label for that value. */
  getOptionByValue?: (value?: any) => T[];
  /** pass a custom onChange to the TypeaheadField */
  onChange?: (vals: any) => void;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** clear menu on custom header click */
  clearMenu?: boolean;
  /** Display errors in a tooltip instead of in a div */
  displayErrorTooltips?: boolean;
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
  onChange,
  outerClassName,
  clearMenu,
  displayErrorTooltips,
  ...rest
}: ITypeaheadFieldProps<T>) {
  const { touched, values, errors, setFieldTouched, setFieldValue } = useFormikContext();
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);
  const isValid = !!getIn(touched, name) && !getIn(errors, name);
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;
  if (!getOptionByValue) {
    getOptionByValue = (value: T) => (!!value ? ([value] as T[]) : ([] as T[]));
  }
  const ref = useRef<any>();
  React.useEffect(() => {
    if (clearMenu && ref.current?.blur) {
      ref.current.blur();
    }
  }, [clearMenu]);
  return (
    <Form.Group className={classNames(!!required ? 'required' : '', outerClassName)}>
      {!!label && <Form.Label>{label}</Form.Label>}
      {!!tooltip && <TooltipIcon toolTipId="typeAhead-tip" toolTip={tooltip} />}
      <TooltipWrapper toolTipId={`${name}-error-tooltip}`} toolTip={errorTooltip}>
        <Typeahead<T>
          {...rest}
          inputProps={{ ...rest.inputProps, name: name, id: `${name}-field` }}
          isInvalid={hasError as any}
          isValid={!hideValidation && isValid}
          selected={getOptionByValue(getIn(values, name))}
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
      </TooltipWrapper>
      {hasError && !displayErrorTooltips && (
        <Feedback type="invalid">{getIn(errors, name)}</Feedback>
      )}
    </Form.Group>
  );
}
