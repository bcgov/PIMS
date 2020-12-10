import { FastCurrencyInput } from 'components/common/form';
import React from 'react';
import { useFormikContext } from 'formik';
import { formatFiscalYear, formatApiDateTime } from 'utils';

const getEditableMoneyCell = (disabled: boolean | undefined, namespace: string, type: string) => {
  return (cellInfo: any) => {
    const context = useFormikContext();
    if (disabled) {
      return cellInfo.value ?? null;
    }
    return (
      <FastCurrencyInput
        key={`${namespace}.${cellInfo.row.index}.${type}.value`}
        formikProps={context}
        field={`${namespace}.${cellInfo.row.index}.${type}.value`}
        disabled={disabled}
      />
    );
  };
};

const getFiscalYear = (field: string) => {
  return (cellInfo: any) => {
    return formatFiscalYear(cellInfo.row.values[field]);
  };
};

const getFormattedDate = (field: string) => {
  return (cellInfo: any) => {
    return formatApiDateTime(cellInfo.row.values[field]);
  };
};

export const getAssessedCols = (
  title: string,
  disabled?: boolean,
  namespace = 'financials',
  includeImprovements?: boolean,
): any => {
  const basicAssessed = [
    {
      Header: 'Assessment Year',
      accessor: 'assessed.year', // accessor is the "key" in the data
      maxWidth: 90,
      align: 'left',
    },
    {
      Header: title,
      accessor: 'assessed.value',
      maxWidth: 140,
      align: 'left',
      Cell: getEditableMoneyCell(disabled, namespace, 'assessed'),
    },
  ];
  const improvements = [
    {
      Header: 'Buildings',
      accessor: 'improvements.value',
      maxWidth: 140,
      align: 'left',
      Cell: getEditableMoneyCell(disabled, namespace, 'improvements'),
    },
  ];
  if (includeImprovements) {
    return [{ Header: 'Assessed Value', columns: [...basicAssessed, ...improvements] }];
  } else {
    return [{ Header: 'Assessed Value', columns: [...basicAssessed] }];
  }
};

export const getNetbookCols = (disabled?: boolean, namespace = 'financials'): any => {
  const netbookCols = [
    {
      Header: 'Net Book Value',
      columns: [
        {
          Header: 'Fiscal Year',
          className: 'year',
          accessor: 'netbook.fiscalYear',
          maxWidth: 50,
          align: 'left',
          Cell: getFiscalYear('netbook.fiscalYear'),
        },
        {
          Header: 'Effective Date',
          accessor: 'netbook.updatedOn',
          maxWidth: 140,
          align: 'left',
          Cell: getFormattedDate('netbook.updatedOn'),
        },
        {
          Header: 'Net Book Value',
          accessor: 'netbook.value',
          maxWidth: 140,
          align: 'left',
          Cell: getEditableMoneyCell(disabled, namespace, 'netbook'),
        },
      ],
    },
  ];
  return netbookCols;
};
