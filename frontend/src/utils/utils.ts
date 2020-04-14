import { ILookupCode } from 'actions/lookupActions';

import { SelectOption } from 'components/common/form';

export const classSet = (input?: any): string => {
  let classes = '';
  if (input) {
    for (const key in input) {
      if (key && !!input[key]) {
        classes += ` ${key}`;
      }
    }
    return classes.trim();
  }
  return '';
};

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
