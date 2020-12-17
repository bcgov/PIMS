import { FastCurrencyInput } from 'components/common/form';
import React from 'react';
import { useFormikContext, getIn } from 'formik';
import { formatFiscalYear, formatApiDateTime, formatMoney } from 'utils';
import { FaBuilding } from 'react-icons/fa';

const getEditableMoneyCell = (disabled: boolean | undefined, namespace: string, type: string) => {
  return (cellInfo: any) => {
    const context = useFormikContext();
    if (disabled) {
      const value = getIn(context.values, `${namespace}.${cellInfo.row.index}.${type}.value`);
      return typeof value === 'number' ? formatMoney(value) : null;
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

export const getAssociatedBuildingsCols = (): any => {
  const associatedBuildingsCols = [
    {
      Header: 'Type',
      accessor: '',
      maxWidth: 50,
      align: 'left',
      Cell: () => <FaBuilding size={24}></FaBuilding>,
    },
    {
      Header: 'Property Name',
      accessor: 'name',
      maxWidth: 140,
      align: 'left',
    },
    {
      Header: 'Classifications',
      accessor: 'classification',
      maxWidth: 140,
      align: 'left',
    },
    {
      Header: 'Street Address',
      accessor: 'address.line1',
      maxWidth: 140,
      align: 'left',
    },
    {
      Header: 'Location',
      accessor: 'address.administrativeArea',
      maxWidth: 140,
      align: 'left',
    },
  ];
  return associatedBuildingsCols;
};
