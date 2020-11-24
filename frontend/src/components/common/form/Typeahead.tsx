import * as React from 'react';
import { Typeahead, TypeaheadModel, TypeaheadProps } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import { getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import TooltipIcon from 'components/common/TooltipIcon';

interface ITypeaheadFieldProps<T extends TypeaheadModel> extends TypeaheadProps<T> {
  name: string;
  label?: string;
  required?: boolean;
  /** whether or not this component is being used to filter so we can ignore the validation checkmark */
  filter?: boolean;
  /**Tooltip text */
  tooltip?: string;
  /** A function that takes in the value stored in formik and returns the corresponding label for that value. */
  getOptionByValue?: (value?: any) => T[];
}

const Group = styled(Form.Group)`
  div {
    width: 100%;
  }
`;

const Label = styled(Form.Label)`
  margin-bottom: 0px;
`;

const Feedback = styled(Form.Control.Feedback)`
  display: block;
`;

export function TypeaheadField<T extends TypeaheadModel>({
  label,
  required,
  name,
  filter,
  tooltip,
  getOptionByValue,
  ...rest
}: ITypeaheadFieldProps<T>) {
  const { touched, values, errors, setFieldTouched, setFieldValue } = useFormikContext();
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);
  const isValid = !!getIn(touched, name) && !getIn(errors, name);
  if (!getOptionByValue) {
    getOptionByValue = (value: T) => (!!value ? ([value] as T[]) : ([] as T[]));
  }
  return (
    <Group>
      {!!label && (
        <Label>
          {label} {!!required && <span className="required">*</span>}
        </Label>
      )}
      {!!tooltip && <TooltipIcon toolTipId="typeAhead-tip" toolTip={tooltip} />}
      <Typeahead<T>
        {...rest}
        inputProps={{ ...rest.inputProps, name: name, id: `${name}-field` }}
        isInvalid={hasError as any}
        isValid={!filter && isValid}
        selected={getOptionByValue(getIn(values, name))}
        onChange={(newValues: T[]) => {
          setFieldValue(name, getIn(newValues[0], 'value') ?? newValues[0]);
        }}
        onBlur={() => setFieldTouched(name, true)}
        id={`${name}-field`}
      />
      {hasError && <Feedback type="invalid">{getIn(errors, name)}</Feedback>}
    </Group>
  );
}
