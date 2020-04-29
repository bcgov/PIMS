import { ILookupCode } from 'actions/lookupActions';

import { SelectOption } from 'components/common/form';
import { FormikProps, getIn } from 'formik';

export const truncate = (input: string, maxLength: number): string => {
  if (input && input.length > 1000) {
    return `${input.substr(0, maxLength)}...`;
  }
  return input;
};

export const decimalOrNull = (input: string): number | null => {
  return input !== '' ? parseInt(input, 10) : null;
};

export const decimalOrEmpty = (input: string): number | string => {
  return input !== '' ? parseInt(input, 10) : '';
};

export const floatOrNull = (input: string): number | null => {
  return input !== '' ? parseFloat(input) : null;
};

export const mapLookupCode = (
  code: ILookupCode,
  defaultId: number | string | null,
): SelectOption => ({
  label: code.name,
  value: code.id.toString(),
  selected: code.id === defaultId,
});

type FormikMemoProps = {
  formikProps: FormikProps<any>;
  field: string;
  disabled?: boolean;
} & any;
/**
 * Common use memo function prevents renders unless associated field data has been changed.
 * Essential for performance on large forms. Adapted from:
 * https://jaredpalmer.com/formik/docs/api/fastfield
 * @param param0 params from previous render
 * @param param1 params from current render
 */
export const formikFieldMemo = (
  { formikProps: currentProps, field: currField }: FormikMemoProps,
  { formikProps: prevProps, field: prevField }: FormikMemoProps,
) => {
  return !(
    currField !== prevField ||
    currentProps.disabled !== prevProps.disabled ||
    getIn(currentProps.values, prevField) !== getIn(prevProps.values, prevField) ||
    getIn(currentProps.errors, prevField) !== getIn(prevProps.errors, prevField) ||
    getIn(currentProps.touched, prevField) !== getIn(prevProps.touched, prevField) ||
    Object.keys(currentProps).length !== Object.keys(prevProps).length ||
    currentProps.isSubmitting !== prevProps.isSubmitting
  );
};
