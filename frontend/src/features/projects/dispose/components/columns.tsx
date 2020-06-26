import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { formatMoney, formatNumber } from 'utils';
import { IProperty, IProject, DisposeWorkflowStatus, AgencyResponses } from '../interfaces';
import { useFormikContext } from 'formik';
import {
  FastCurrencyInput,
  Input,
  FastSelect,
  Check,
  Select,
  SelectOption,
} from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import { FaRegTimesCircle } from 'react-icons/fa';
import _ from 'lodash';

const sumFinancialRows = (properties: IProperty[], key: string): string => {
  const sum = formatNumber(_.reduce(_.map(properties, key), (acc, val) => acc + val) ?? 0);
  return sum === 'NaN' ? '$0' : `$${sum}`;
};

const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);

const EditableMoneyCell = (cellInfo: any) => {
  const context = useFormikContext();
  return (
    <FastCurrencyInput
      formikProps={context}
      field={`properties.${cellInfo.row.id}.${cellInfo.column.id}`}
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
    />
  );
};

/**
 * Create a formik input using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 */
const EditableParcelInputCell = (cellInfo: any) => {
  if (cellInfo.row.original.propertyTypeId === 1) {
    return cellInfo.value ?? null;
  }
  return <Input field={`properties.${cellInfo.row.id}.${cellInfo.column.id}`}></Input>;
};

const CheckCell = (cellInfo: any) => {
  return (
    <Check
      disabled={true}
      field={`projectAgencyResponses.${cellInfo.row.id}.${cellInfo.column.id}`}
    />
  );
};

const responseOptions: SelectOption[] = [
  { label: AgencyResponses.Ignore, value: AgencyResponses.Ignore },
  { label: AgencyResponses.Watch, value: AgencyResponses.Watch },
];

const EditableSelect = (cellInfo: any) => {
  return (
    <Select
      options={responseOptions}
      field={`projectAgencyResponses.${cellInfo.row.id}.${cellInfo.column.id}`}
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
  const cols = getColumns(columnOptions);
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

export const getColumns = ({
  project,
  editableClassification,
  editableFinancials,
  editableZoning,
  limitLabels,
}: IDisposeColumnOptions): any => [
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
    Header: 'Civic Address',
    accessor: 'address',
    align: 'left',
    clickable: true,
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
    Footer: () => <span>Sum</span>,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: editableFinancials ? EditableMoneyCell : MoneyCell,
    minWidth: 145,
    align: 'left',
    Footer: ({ properties }: { properties: IProperty[] }) => (
      <span>
        {useProjectFinancialValues(project, editableFinancials)
          ? formatMoney(project.netBook)
          : sumFinancialRows(properties, 'netBook')}
      </span>
    ),
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: editableFinancials ? EditableMoneyCell : MoneyCell,
    minWidth: 145,
    align: 'left',
    Footer: ({ properties }: { properties: IProperty[] }) => (
      <span>
        {useProjectFinancialValues(project, editableFinancials)
          ? formatMoney(project.estimated)
          : sumFinancialRows(properties, 'estimated')}
      </span>
    ),
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: editableFinancials ? EditableMoneyCell : MoneyCell,
    minWidth: 145,
    align: 'left',
    Footer: ({ properties }: { properties: IProperty[] }) => (
      <span>
        {useProjectFinancialValues(project, editableFinancials)
          ? formatMoney(project.assessed)
          : sumFinancialRows(properties, 'assessed')}
      </span>
    ),
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
];

export const getProjectAgencyResponseColumns = (editable?: boolean): any => [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
  },
  {
    Header: 'Notification Sent?',
    accessor: 'notificationId',
    align: 'left',
    Cell: CheckCell,
  },
  {
    Header: 'Response',
    accessor: 'response',
    maxWidth: 170,
    align: 'left',
    Cell: EditableSelect,
  },
];
