import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { formatMoney, formatNumber, formatDate } from 'utils';
import { IProperty, IProject, DisposeWorkflowStatus, AgencyResponses } from '../interfaces';
import { useFormikContext, getIn } from 'formik';
import {
  FastCurrencyInput,
  FastSelect,
  Select,
  SelectOption,
  FastInput,
  TextArea,
  FastDatePicker,
} from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import { FaRegTimesCircle } from 'react-icons/fa';
import _ from 'lodash';
import { IAgencyResponseColumns } from 'features/projects/erp/forms/AgencyResponseForm';

const sumFinancialRows = (properties: IProperty[], key: string): string => {
  const sum = formatNumber(_.reduce(_.map(properties, key), (acc, val) => acc + val) ?? 0);
  return sum === 'NaN' ? '$0' : `$${sum}`;
};

const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);

const getEditableMoneyCell = (namespace: string = 'properties') => (cellInfo: any) => {
  const context = useFormikContext();
  return (
    <FastCurrencyInput
      formikProps={context}
      field={`${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`}
    ></FastCurrencyInput>
  );
};

const getEditableClassificationCell = (limitLabels?: string[]) => (cellInfo: any) => {
  const classifications = useCodeLookups().getOptionsByType('PropertyClassification');
  const context = useFormikContext();
  return (
    <FastSelect
      limitLabels={limitLabels}
      formikProps={context}
      type="number"
      options={classifications}
      field={`properties.${cellInfo.row.id}.classificationId`}
      errorPrompt={true}
    />
  );
};

/**
 * Create a formik input using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 */
const EditableParcelInputCell = (cellInfo: any) => {
  const formikProps = useFormikContext();
  if (cellInfo.row.original.propertyTypeId === 1) {
    return cellInfo.value ?? null;
  }
  return (
    <FastInput
      formikProps={formikProps}
      field={`properties.${cellInfo.row.id}.${cellInfo.column.id}`}
    ></FastInput>
  );
};

/**
 * Create a formik input using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 */
const EditableInputCell = (cellInfo: any) => {
  const formikProps = useFormikContext();
  return (
    <FastInput
      formikProps={formikProps}
      field={`properties.${cellInfo.row.id}.${cellInfo.column.id}`}
    ></FastInput>
  );
};

/**
 * Create a formik text area using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 */
const getEditableTextAreaCell = (namespace: string = 'properties') => (cellInfo: any) => {
  return <TextArea fast field={`${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`}></TextArea>;
};

/**
 * Create a formik date picker using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 * @param minDate restrict the minimum date that can be selected
 * @param oldDateWarning warn if the user selects an old date
 */
const getEditableDatePickerCell = (
  namespace: string = 'properties',
  minDate: boolean = false,
  oldDateWarning?: boolean,
) => (cellInfo: any) => {
  const formikProps = useFormikContext();
  return (
    <FastDatePicker
      formikProps={formikProps}
      oldDateWarning={oldDateWarning}
      field={`${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`}
      minDate={
        minDate
          ? getIn(formikProps.values, `${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`)
          : undefined
      }
    ></FastDatePicker>
  );
};

const responseOptions: SelectOption[] = [
  { label: AgencyResponses.Ignore, value: AgencyResponses.Ignore },
  { label: AgencyResponses.Watch, value: AgencyResponses.Watch },
];

const getEditableSelectCell = (namespace: string = 'properties') => (cellInfo: any) => {
  return (
    <Select
      options={responseOptions}
      field={`${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`}
    />
  );
};

export interface IDisposeColumnOptions {
  project: IProject;
  editableClassification?: boolean;
  editableFinancials?: boolean;
  editableZoning?: boolean;
  limitLabels?: string[];
}

export const getColumnsWithRemove = (
  columnOptions: IDisposeColumnOptions & { setProperties: Function },
) => {
  const cols = getPropertyColumns(columnOptions);
  cols.unshift({
    Header: '',
    align: 'left',
    accessor: 'id',
    maxWidth: 40,
    Cell: (props: any) => (
      <FaRegTimesCircle
        title="Click to remove from project"
        style={{ cursor: 'pointer' }}
        size={16}
        onClick={() => {
          columnOptions.setProperties(
            _.difference(_.map(props.rows, 'original'), [props.row.original]),
          );
        }}
      />
    ),
  });
  return cols;
};

const useProjectFinancialValues = (project: IProject, editable?: boolean) => {
  return !editable && project.statusCode === DisposeWorkflowStatus.Review;
};

export const defaultPropertyColumns: any[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Property Name',
    accessor: 'description',
    maxWidth: 170,
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Civic Address',
    accessor: 'address',
    align: 'left',
    clickable: true,
  },
];

export const getPropertyColumns = ({
  project,
  editableClassification,
  editableFinancials,
  editableZoning,
  limitLabels,
}: IDisposeColumnOptions): any =>
  defaultPropertyColumns.concat([
    {
      Header: 'Classification',
      accessor: 'classification',
      width: 140,
      align: 'left',
      Cell: editableClassification
        ? getEditableClassificationCell(limitLabels)
        : (cellInfo: any) => cellInfo.value,
      clickable: !editableClassification,
    },
    {
      Header: 'Current Zoning Code',
      accessor: 'zoning',
      align: 'left',
      clickable: !editableZoning,
      Cell: editableZoning ? EditableParcelInputCell : (cellInfo: any) => cellInfo.value ?? null,
    },
    {
      Header: 'Potential Zoning Code',
      accessor: 'zoningPotential',
      align: 'left',
      clickable: !editableZoning,
      Cell: editableZoning ? EditableParcelInputCell : (cellInfo: any) => cellInfo.value ?? null,
    },
    {
      Header: 'Netbook Value',
      accessor: 'netBook',
      Cell: editableFinancials ? getEditableMoneyCell() : MoneyCell,
      minWidth: 145,
      align: 'left',
    },
    {
      Header: 'Estimated Value',
      accessor: 'estimated',
      Cell: editableFinancials ? getEditableMoneyCell() : MoneyCell,
      minWidth: 145,
      align: 'left',
    },
    {
      Header: 'Assessed Value',
      accessor: 'assessed',
      Cell: editableFinancials ? getEditableMoneyCell() : MoneyCell,
      minWidth: 145,
      align: 'left',
    },
    {
      Header: 'Type',
      accessor: 'propertyTypeId',
      width: 60,
      clickable: true,
      Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
        const icon = value === 0 ? <LandSvg title="Land" /> : <BuildingSvg title="Building" />;
        return icon;
      },
    },
  ]);

export const getAppraisedColumns = (project: IProject): any[] => [
  {
    Header: 'Property Name',
    accessor: 'description',
    maxWidth: 170,
    align: 'left',
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
  },
  {
    Header: 'City',
    accessor: 'city',
    align: 'left',
  },
  {
    Header: 'Municipality',
    accessor: 'municipality',
    align: 'left',
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    width: 60,
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      const icon = value === 0 ? <LandSvg title="Land" /> : <BuildingSvg title="Building" />;
      return icon;
    },
  },
  {
    Header: 'Appraised Value',
    accessor: 'appraised',
    Cell: getEditableMoneyCell(),
    minWidth: 145,
    align: 'left',
    Footer: ({ properties }: { properties: IProperty[] }) => (
      <span>
        {useProjectFinancialValues(project, true)
          ? formatMoney(project.appraised)
          : sumFinancialRows(properties, 'appraised')}
      </span>
    ),
  },
  {
    Header: 'Appraised Date',
    accessor: 'appraisedDate',
    Cell: getEditableDatePickerCell('properties', undefined, true),
    minWidth: 145,
    align: 'left',
  },
  {
    Header: 'Appraisal Firm',
    accessor: 'appraisedFirm',
    Cell: EditableInputCell,
    minWidth: 145,
    align: 'left',
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: getEditableMoneyCell(),
    minWidth: 145,
    align: 'left',
    Footer: ({ properties }: { properties: IProperty[] }) => (
      <span>
        {useProjectFinancialValues(project, true)
          ? formatMoney(project.assessed)
          : sumFinancialRows(properties, 'assessed')}
      </span>
    ),
  },
  {
    Header: 'Assessed Date',
    accessor: 'assessedDate',
    Cell: getEditableDatePickerCell('properties', undefined, true),
    minWidth: 145,
    align: 'left',
  },
];

export const getProjectAgencyResponseColumns = ({
  offerAmount,
  disabled,
}: IAgencyResponseColumns): any => {
  const cols = [
    {
      Header: 'Agency',
      accessor: 'agencyCode', // accessor is the "key" in the data
      align: 'left',
    },
    {
      Header: 'Business Case Received Date',
      accessor: 'receivedOn',
      maxWidth: 60,
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) => formatDate(cellInfo.value) ?? null
        : getEditableDatePickerCell('projectAgencyResponses'),
    },
    {
      Header: 'Note',
      accessor: 'note',
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) => cellInfo.value ?? null
        : getEditableTextAreaCell('projectAgencyResponses'),
    },
    {
      Header: 'Response',
      accessor: 'response',
      maxWidth: 60,
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) => cellInfo.value ?? null
        : getEditableSelectCell('projectAgencyResponses'),
    },
  ];

  if (offerAmount === true) {
    cols.push({
      Header: 'Offer',
      accessor: 'offerAmount',
      maxWidth: 60,
      align: 'left',
      Cell: offerAmount
        ? getEditableMoneyCell('projectAgencyResponses')
        : (cellInfo: any) => cellInfo.value ?? null,
    });
  }
  return cols;
};
