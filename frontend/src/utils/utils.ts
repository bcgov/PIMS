import { ILookupCode } from 'actions/lookupActions';
import { startCase, isNull, isUndefined, isEmpty, lowerFirst, keys } from 'lodash';
import { SelectOption } from 'components/common/form';
import { FormikProps, getIn } from 'formik';
import { SortDirection, TableSort } from 'components/Table/TableSort';
import { AxiosError } from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { success, error, request } from 'actions/genericActions';
import moment from 'moment-timezone';
import { IStatus } from 'features/projects/common';

/**
 * Truncates the specified 'input' value to the 'maxLength'.
 * @param input Text value you want to truncate.
 * @param maxLength The maximum length of the new string value.
 */
export const truncate = (input: string, maxLength: number): string => {
  if (input && input.length > 1000) {
    return `${input.substr(0, maxLength)}...`;
  }
  return input;
};

/**
 * Convert the specified 'input' value into a decimal or undefined.
 * @param input The string value to convert to a decimal.
 */
export const decimalOrUndefined = (input: string): number | undefined => {
  return input !== '' && input !== undefined ? parseInt(input, 10) : undefined;
};

/**
 * Convert the specified 'input' value into a decimal or null.
 * @param input The string value to convert to a decimal.
 */
export const decimalOrNull = (input: string): number | null => {
  return input !== '' && input !== undefined ? parseInt(input, 10) : null;
};

/**
 * Convert the specified 'input' value into a decimal or empty string.
 * @param input The string value to convert to a decimal.
 */
export const decimalOrEmpty = (input: string): number | string => {
  return input !== '' && input !== undefined ? parseInt(input, 10) : '';
};

/**
 * Convert the specified 'input' value into a float or null.
 * @param input The string value to convert to a float.
 */
export const floatOrNull = (input: string): number | null => {
  return input !== '' && input !== undefined ? parseFloat(input) : null;
};

/**
 * Convert the specified 'input' value into a float or undefined.
 * @param input The string value to convert to a float.
 */
export const floatOrUndefined = (input: string): number | undefined => {
  return input !== '' && input !== undefined ? parseFloat(input) : undefined;
};

/**
 * Determine if the specified 'input' value is a positive number of zero.
 * @param input The value to evaluate.
 * @returns True if the value is a positive number or zero, false otherwise.
 */
export const isPositiveNumberOrZero = (input: string | number | undefined | null) => {
  if (isNull(input) || isUndefined(input)) {
    return false;
  }

  if (typeof input === 'string' && isEmpty(input.trim())) {
    return false;
  }

  return !isNaN(Number(input)) && Number(input) > -1;
};

/** used for filters that need to display the string value of a parent agency agency */
export const mapLookupCodeWithParentString = (
  code: ILookupCode,
  /** the list of lookup codes to look for parent */
  options: ILookupCode[],
): SelectOption => ({
  label: code.name,
  value: code.id.toString(),
  code: code.code,
  parentId: code.parentId,
  parent: options.find((a: ILookupCode) => a.id.toString() === code.parentId?.toString())?.name,
});

const createParentWorkflow = (code: string) => {
  if (/^DR/.test(code)) {
    return { name: 'Draft Statuses', id: 1 };
  } else if (/EXE/.test(code)) {
    return { name: 'Exemption Statuses', id: 2 };
  } else if (/^AS/.test(code)) {
    return { name: 'Assessment Statuses', id: 3 };
  } else if (/^ERP/.test(code) || /^AP-ERP$/.test(code)) {
    return { name: 'ERP Statuses', id: 4 };
  } else if (/^SPL/.test(code) || /^AP-SPL$/.test(code)) {
    return { name: 'SPL Statuses', id: 5 };
  } else {
    return { name: 'General Statuses', id: 6 };
  }
};

/** used for inputs that need to display the string value of a parent agency agency */
export const mapSelectOptionWithParent = (
  code: SelectOption,
  /** the list of lookup codes to look for parent */
  options: SelectOption[],
): SelectOption => ({
  label: code.label,
  value: code.value.toString(),
  code: code.code,
  parentId: code.parentId,
  parent: options.find((a: SelectOption) => a.value.toString() === code.parentId?.toString())
    ?.label,
});

export const mapStatuses = (status: IStatus): SelectOption => ({
  label: status.name,
  value: status.id.toString(),
  parent: createParentWorkflow(status.code).name,
  parentId: createParentWorkflow(status.code).id,
});

type FormikMemoProps = {
  formikProps: FormikProps<any>;
  field: string;
  disabled?: boolean;
  options?: SelectOption[];
} & any;
/**
 * Common use memo function prevents renders unless associated field data has been changed.
 * Essential for performance on large forms. Adapted from:
 * https://jaredpalmer.com/formik/docs/api/fastfield
 * @param param0 params from previous render
 * @param param1 params from current render
 */
export const formikFieldMemo = (
  {
    formikProps: currentProps,
    field: currField,
    disabled: currentDisabled,
    options: currentOptions,
  }: FormikMemoProps,
  {
    formikProps: prevProps,
    field: prevField,
    disabled: prevDisabled,
    options: prevOptions,
  }: FormikMemoProps,
) => {
  return !(
    currField !== prevField ||
    currentDisabled !== prevDisabled ||
    currentOptions !== prevOptions ||
    getIn(currentProps.values, prevField) !== getIn(prevProps.values, prevField) ||
    getIn(currentProps.errors, prevField) !== getIn(prevProps.errors, prevField) ||
    getIn(currentProps.touched, prevField) !== getIn(prevProps.touched, prevField) ||
    Object.keys(currentProps).length !== Object.keys(prevProps).length ||
    currentProps.isSubmitting !== prevProps.isSubmitting
  );
};

/** Provides default redux boilerplate applicable to most axios redux actions
 * @param dispatch Dispatch function
 * @param actionType All dispatched GenericNetworkActions will use this action type.
 * @param axiosPromise The result of an axios.get, .put, ..., call.
 */
export const handleAxiosResponse = (
  dispatch: Function,
  actionType: string,
  axiosPromise: Promise<any>,
): Promise<any> => {
  dispatch(request(actionType));
  dispatch(showLoading());
  return axiosPromise
    .then((response: any) => {
      dispatch(success(actionType));
      dispatch(hideLoading());
      return response.data ?? response.payload;
    })
    .catch((axiosError: AxiosError) => {
      dispatch(error(actionType, axiosError?.response?.status, axiosError));
      throw axiosError;
    })
    .finally(() => {
      dispatch(hideLoading());
    });
};

export const validateFormikWithCallback = (formikProps: FormikProps<any>, callback: Function) => {
  formikProps.validateForm().then((errors: any) => {
    if (errors !== undefined && Object.keys(errors).length === 0) {
      callback();
    } else {
      //force formik to display the validation errors.
      formikProps.submitForm();
    }
  });
};
export const generateSortCriteria = (column: string, direction: SortDirection) => {
  if (!column || !direction) {
    return '';
  }

  return `${startCase(column).replace(' ', '')} ${direction}`;
};

/**
 * convert table sort config to api sort query
 * {name: 'desc} = ['Name desc']
 */
export const generateMultiSortCriteria = (sort: TableSort<any>) => {
  if (!sort) {
    return '';
  }

  return keys(sort).map(key => `${startCase(key).replace(' ', '')} ${sort[key]}`);
};

/**
 * Convert sort query string to TableSort config
 * ['Name desc'] = {name: 'desc'}
 */
export const resolveSortCriteriaFromUrl = (input: string[]): TableSort<any> | {} => {
  if (isEmpty(input)) {
    return {};
  }

  return input.reduce((acc: any, sort: string) => {
    const fields = sort.split(' ');
    if (fields.length !== 2) {
      return { ...acc };
    }

    return { ...acc, [lowerFirst(fields[0])]: fields[1] };
  }, {});
};

/**
 * get the fiscal year (ending in) based on the current date.
 */
export const getCurrentFiscalYear = (): number => {
  const now = moment();
  return now.month() >= 4 ? now.add(1, 'years').year() : now.year();
};

export const getFiscalYear = (date?: Date | string): number => {
  let momentDate = undefined;
  if (typeof date === 'string' || date instanceof String) {
    momentDate = moment(date, 'YYYY-MM-DD');
  } else {
    momentDate = moment(date);
  }
  return momentDate.month() >= 4 ? momentDate.add(1, 'years').year() : momentDate.year();
};

export const formatDate = (date?: string | Date) => {
  return !!date ? moment(date).format('YYYY-MM-DD') : '';
};

export const formatDateTime = (date: string | undefined) => {
  return !!date ? moment(date).format('YYYY-MM-DD hh:mm a') : '';
};

export const formatFiscalYear = (year: string | number | undefined): string => {
  if (year === undefined) return '';
  const fiscalYear = +year;
  const previousFiscalYear = fiscalYear - 1;
  return `${previousFiscalYear.toString().slice(-2)}/${fiscalYear.toString().slice(-2)}`;
};
/**
 * Format the passed string date assuming the date was recorded in UTC (as is the case with the pims API server).
 * Returns a date formatted for display in the current time zone of the user.
 * @param date utc date/time string.
 */
export const formatApiDateTime = (date: string | undefined) => {
  return !!date
    ? moment
        .utc(date)
        .local()
        .format('YYYY-MM-DD hh:mm a')
    : '';
};

export const formatDateFiscal = (date: string | undefined) => {
  return !!date
    ? `${moment(date)
        .subtract(1, 'years')
        .format('YYYY')}/${moment(date).format('YYYY')}`
    : '';
};

/**
 * Get the current date time in the UTC timezone. This allows the frontend to create timestamps that are compatible with timestamps created by the API.
 */
export const generateUtcNowDateTime = () =>
  moment(new Date())
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss.SSSSSSS');

/**
 * Returns true only if the passed mouse event occurred within the last 500ms, or the mouse event is null.
 */
export const isMouseEventRecent = (e?: MouseEvent | null) =>
  e === null || (!!e?.timeStamp && e.timeStamp >= (document?.timeline?.currentTime ?? 0) - 500);

/**
 * Convert the passed square meter value to hectares.
 * @param squareMeters
 */
export const squareMetersToHectares = (squareMeters: number) => (squareMeters / 10000).toFixed(2);

export function stringToNull(value: any) {
  return emptyStringToNull(value, value);
}

export function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return undefined;
  }
  return value;
}

/**
 * Determine if the specified project status code requires a clearance notification sent on value.
 * @param statusCode The project status code.
 */
export const clearanceNotificationSentOnRequired = (statusCode: string) => {
  return ['ERP-ON', 'ERP-OH'].includes(statusCode);
};
