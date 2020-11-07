import { ILookupCode } from 'actions/lookupActions';
import { startCase, isNull, isUndefined, isEmpty } from 'lodash';
import { SelectOption } from 'components/common/form';
import { FormikProps, getIn } from 'formik';
import { SortDirection } from 'components/Table/TableSort';
import { AxiosError } from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { success, error, request } from 'actions/genericActions';
import moment from 'moment-timezone';
import { IStatus } from 'features/projects/common';

export const truncate = (input: string, maxLength: number): string => {
  if (input && input.length > 1000) {
    return `${input.substr(0, maxLength)}...`;
  }
  return input;
};

export const decimalOrUndefined = (input: string | ''): number | undefined => {
  return input !== '' ? parseInt(input, 10) : undefined;
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

export const isPositiveNumberOrZero = (input: string | number | undefined | null) => {
  if (isNull(input) || isUndefined(input)) {
    return false;
  }

  if (typeof input === 'string' && isEmpty(input.trim())) {
    return false;
  }

  return !isNaN(Number(input)) && Number(input) > -1;
};

export const mapLookupCode = (
  code: ILookupCode,
  defaultId: number | string | null,
): SelectOption => ({
  label: code.name,
  value: code.id.toString(),
  selected: code.id === defaultId,
  code: code.code,
  parentId: code.parentId,
});

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

export const mapStatuses = (status: IStatus): SelectOption => ({
  label: status.name,
  value: status.id.toString(),
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
  { formikProps: currentProps, field: currField, disabled: currentDisabled }: FormikMemoProps,
  { formikProps: prevProps, field: prevField, disabled: prevDisabled }: FormikMemoProps,
) => {
  return !(
    currField !== prevField ||
    currentDisabled !== prevDisabled ||
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
 * get the fiscal year (ending in) based on the current date.
 */
export const getCurrentFiscalYear = (): number => {
  const now = moment();
  return now.month() >= 3 ? now.add(1, 'years').year() : now.year();
};

export const getFiscalYear = (date?: Date | string): number => {
  let momentDate = undefined;
  if (typeof date === 'string' || date instanceof String) {
    momentDate = moment(date, 'YYYY-MM-DD');
  } else {
    momentDate = moment(date);
  }
  return momentDate.month() >= 3 ? momentDate.add(1, 'years').year() : momentDate.year();
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
