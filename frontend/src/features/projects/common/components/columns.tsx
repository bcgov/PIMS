import React from 'react';
import { formatMoney, formatNumber, formatDate } from 'utils';
import { IProperty, IProject, DisposeWorkflowStatus, AgencyResponses } from '../interfaces';
import { useFormikContext, getIn } from 'formik';
import {
  FastSelect,
  SelectOption,
  FastInput,
  TextArea,
  FastDatePicker,
} from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import { FaRegTimesCircle } from 'react-icons/fa';
import _ from 'lodash';
import { IAgencyResponseColumns } from 'features/projects/erp/forms/AgencyResponseForm';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { EditableMoneyCell, MoneyCell } from 'components/Table/MoneyCell';
import { PropertyTypes } from 'constants/propertyTypes';
import { PropertyTypeCell } from 'components/Table/PropertyTypeCell';

const ColumnDiv = styled.div`
  display: flex;
  flex-flow: column;
`;

const sumFinancialRows = (properties: IProperty[], key: string): string => {
  const sum = formatNumber(_.reduce(_.map(properties, key), (acc, val) => acc + val) ?? 0);
  return sum === 'NaN' ? '$0' : `$${sum}`;
};

const getEditableClassificationCell = (limitLabels?: string[]) => (cellInfo: any) => {
  const classifications = useCodeLookups().getPropertyClassificationOptions();
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
export const getEditableTextAreaCell = (namespace: string = 'properties') => (cellInfo: any) => {
  return <TextArea fast field={`${namespace}.${cellInfo.row.id}.${cellInfo.column.id}`}></TextArea>;
};

/**
 * Create a formik date picker using the passed cellinfo to get the associated data.
 * This information is only editable if this cell belongs to a parcel row.
 * @param cellInfo provided by react table
 * @param minDate restrict the minimum date that can be selected
 * @param oldDateWarning warn if the user selects an old date
 */
export const getEditableDatePickerCell = (
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
  { label: 'Not Interested', value: AgencyResponses.Ignore },
  { label: 'Interested', value: AgencyResponses.Watch },
];

export const getProjectLinkCell = (namespace: string = 'properties') => (cellInfo: any) => {
  const { values } = useFormikContext<IProject>();
  const projectNumbers = _.filter(cellInfo.value, (p: string) => values.projectNumber !== p);
  return (
    <ColumnDiv>
      {projectNumbers?.map((projectNumber: string) => (
        <React.Fragment key={projectNumber}>
          <Link to={`/projects?projectNumber=${projectNumber}`}>{projectNumber}</Link>
        </React.Fragment>
      ))}
    </ColumnDiv>
  );
};

export const getEditableSelectCell = (namespace: string = 'properties') => (cellInfo: any) => {
  const formikProps = useFormikContext();
  return (
    <FastSelect
      formikProps={formikProps}
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
    accessor: (row: IProperty) =>
      row.subAgency ? `${row.subAgency} (${row.agencyCode})` : row.agencyCode, // accessor is the "key" in the data
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Name',
    accessor: (row: IProperty) => row.name ?? row.pid,
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
      Header: 'Other Projects',
      accessor: 'projectNumbers',
      align: 'left',
      clickable: false,
      Cell: getProjectLinkCell(),
    },
    {
      Header: 'Net Book Value',
      accessor: 'netBook',
      Cell: editableFinancials ? EditableMoneyCell : MoneyCell,
      minWidth: 145,
      clickable: !editableFinancials,
      align: 'left',
    },
    {
      Header: 'Market Value',
      accessor: 'market',
      Cell: editableFinancials ? EditableMoneyCell : MoneyCell,
      minWidth: 145,
      clickable: !editableFinancials,
      align: 'left',
    },
    {
      Header: 'Assessed Land',
      accessor: (row: IProperty) =>
        [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(row.propertyTypeId)
          ? row.assessedLand
          : undefined,
      Cell: MoneyCell,
      clickable: true,
      minWidth: 145,
      align: 'left',
    },
    {
      Header: 'Assessed Building',
      accessor: (row: IProperty) => row.assessedBuilding,
      Cell: MoneyCell,
      clickable: true,
      minWidth: 145,
      align: 'left',
    },
    {
      Header: 'Type',
      accessor: 'propertyTypeId',
      width: 60,
      clickable: true,
      Cell: PropertyTypeCell,
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
    Header: 'Location',
    accessor: 'administrativeArea',
    align: 'left',
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    width: 60,
    Cell: PropertyTypeCell,
  },
  {
    Header: 'Appraised Value',
    accessor: 'appraised',
    Cell: EditableMoneyCell,
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
    Cell: EditableMoneyCell,
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
        ? (props: any) => <EditableMoneyCell {...props} namespace="projectAgencyResponses" />
        : (cellInfo: any) => cellInfo.value ?? null,
    });
  }
  return cols;
};
