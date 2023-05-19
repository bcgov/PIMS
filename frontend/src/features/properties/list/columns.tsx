import { ILookupCode } from 'actions/ILookupCode';
import { FastCurrencyInput, Input, Select, SelectOption } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { ColumnWithProps } from 'components/Table';
import { AsterixMoneyCell, EditableMoneyCell, MoneyCell } from 'components/Table/MoneyCell';
import { PropertyTypeCell } from 'components/Table/PropertyTypeCell';
import { PropertyTypes } from 'constants/index';
import { getEditableClassificationCell } from 'features/projects/common/components/columns';
import _, { isEqual } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { CellProps, Renderer } from 'react-table';
import styled from 'styled-components';
import { formatNumber, mapLookupCode } from 'utils';

import { IProperty } from '.';

export const ColumnDiv = styled.div`
  display: flex;
  flex-flow: column;
  padding-right: 5px;
`;

const NumberCell: Renderer<CellProps<IProperty, number>> = ({ cell: { value } }) => (
  <span>{formatNumber(value)}</span>
);

// NOTE - There numbers below match the total number of columns ATM (13)
// If additional columns are added or deleted, these numbers need tp be updated...
const howManyColumns = 13;
const totalWidthPercent = 100; // how wide the table should be; e.g. 100%

// Setup a few sample widths: x/2, 1x, 2x (percentage-based)
const unit = Math.floor(totalWidthPercent / howManyColumns);
const spacing = {
  xxsmall: 1,
  xsmall: unit / 4,
  small: unit / 2,
  medium: unit,
  large: unit * 2,
  xlarge: unit * 4,
  xxlarge: unit * 8,
};

const getProjectLinkNoDrafts = () => (cellInfo: any) => {
  const projectNumbers = _.filter(cellInfo.value, (p: string) => !p.includes('DRAFT'));
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

export const columns = (
  agencyOptions: SelectOption[],
  subAgencies: SelectOption[],
  municipalities: ILookupCode[],
  propertyClassifications: SelectOption[],
  propertyType: number,
  editable?: boolean,
): ColumnWithProps<IProperty>[] => [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.xsmall,
    minWidth: 80, // px
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        className: 'agency-search',
        name: 'agencies[0]',
        options: agencyOptions.map((a) => ({ ...a, parentId: a.value })),
        inputSize: 'large',
        placeholder: 'Filter by agency',
        filterBy: ['code'],
        hideParent: true,
        clearButton: true,
        getOptionByValue: (value: number | string) => {
          return agencyOptions.filter((a) => Number(a.value) === Number(value));
        },
      },
    },
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        name: 'agencies[1]',
        placeholder: 'Filter by sub agency',
        className: 'agency-search',
        options: subAgencies,
        clearButton: true,
        labelKey: (option: SelectOption) => {
          return `${option.label}`;
        },
        getOptionByValue: (value: number | string) => {
          return subAgencies.filter((a) => Number(a.value) === Number(value));
        },
      },
    },
  },
  {
    Header: 'Property Name',
    accessor: 'name',
    align: 'left',
    clickable: true,
    responsive: true,
    width: spacing.medium,
    minWidth: 140,
    sortable: true,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    responsive: false,
    width: spacing.small,
    minWidth: 90,
    Cell: editable ? getEditableClassificationCell() : (cellInfo: any) => cellInfo.value,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        field: 'classificationId',
        name: 'classificationId',
        placeholder: 'Filter by class',
        className: 'location-search',
        options: propertyClassifications,
        labelKey: (option: SelectOption) => {
          return `${option.label}`;
        },
        clearButton: true,
        getOptionByValue: (value: number | string) => {
          return propertyClassifications.filter((a) => isEqual(a.value, value));
        },
      },
    },
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: PropertyTypeCell as Renderer<CellProps<IProperty, number>>,
    clickable: true,
    responsive: true,
    width: spacing.xsmall,
    minWidth: 60,
  },
  {
    Header: 'PID',
    accessor: 'pid',
    width: spacing.medium,
    responsive: true,
    align: 'left',
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
    clickable: true,
    responsive: true,
    width: spacing.medium,
    minWidth: 100,
    sortable: true,
  },
  {
    Header: 'Location',
    accessor: 'administrativeArea',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        name: 'administrativeArea',
        placeholder: 'Filter by location',
        className: 'location-search',
        options: municipalities.map(mapLookupCode).map((x) => x.label),
        clearButton: true,
        hideValidation: true,
      },
    },
  },
  {
    Header: 'Assessed Land',
    accessor: 'assessedLand',
    Cell: !editable
      ? (MoneyCell as Renderer<CellProps<IProperty, number | undefined>>)
      : (props: any) => (
          <EditableMoneyCell
            {...props}
            suppressValidation
            tooltip="Editing financial values will update most recent year only"
          />
        ),
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 100,
    clickable: !editable,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxAssessedValue',
        name: 'maxAssessedValue',
        placeholder: 'Max Assessed value',
        tooltip: 'Filter by max assessed value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Assessed Building(s)',
    accessor: 'assessedBuilding',
    Cell: !editable
      ? propertyType === PropertyTypes.BUILDING
        ? (AsterixMoneyCell as Renderer<CellProps<IProperty, number | undefined>>)
        : (MoneyCell as Renderer<CellProps<IProperty, number | undefined>>)
      : (props: any) => (
          <EditableMoneyCell
            {...props}
            suppressValidation
            tooltip="Editing financial values will update most recent year only"
          />
        ),
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 100,
    clickable: !editable,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxAssessedValue',
        name: 'maxAssessedValue',
        placeholder: 'Max Assessed value',
        tooltip: 'Filter by max assessed value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Net Book Value',
    accessor: 'netBook',
    Cell: !editable
      ? (MoneyCell as Renderer<CellProps<IProperty, number>>)
      : (props: any) => (
          <EditableMoneyCell
            {...props}
            suppressValidation
            tooltip="Editing financial values will update most recent year only"
          />
        ),
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 100,
    clickable: !editable,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxNetBookValue',
        name: 'maxNetBookValue',
        placeholder: 'Max Net Book Value',
        tooltip: 'Filter by max net book value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Lot Size (in\u00A0ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 120,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: Input,
      props: {
        field: 'maxLotSize',
        name: 'maxLotSize',
        placeholder: 'Filter by Lot Size',
        className: 'filter-input-control',
        type: 'number',
      },
    },
  },
  {
    Header: 'Project #',
    width: spacing.xsmall,
    minWidth: 60,
    accessor: 'projectNumbers',
    clickable: false,
    align: 'right',
    Cell: getProjectLinkNoDrafts(),
  },
];

export const buildingColumns = (
  agencyOptions: SelectOption[],
  subAgencies: SelectOption[],
  municipalities: ILookupCode[],
  propertyClassifications: SelectOption[],
  propertyType: number,
  editable?: boolean,
): ColumnWithProps<IProperty>[] => [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.xsmall,
    minWidth: 80, // px
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        className: 'agency-search',
        name: 'agencies[0]',
        options: agencyOptions.map((a) => ({ ...a, parentId: a.value })),
        inputSize: 'large',
        placeholder: 'Filter by agency',
        filterBy: ['code'],
        hideParent: true,
        clearButton: true,
      },
    },
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        name: 'agencies[1]',
        placeholder: 'Filter by sub agency',
        className: 'agency-search',
        options: subAgencies,
        labelKey: (option: SelectOption) => {
          return `${option.label}`;
        },
      },
    },
  },
  {
    Header: 'Property Name',
    accessor: 'name',
    align: 'left',
    clickable: true,
    responsive: true,
    width: spacing.medium,
    minWidth: 140,
    sortable: true,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    responsive: false,
    width: spacing.small,
    minWidth: 90,
    Cell: editable ? getEditableClassificationCell() : (cellInfo: any) => cellInfo.value,
    sortable: true,
    filterable: true,
    filter: {
      component: Select,
      props: {
        field: 'classificationId',
        name: 'classificationId',
        placeholder: 'Filter by class',
        className: 'location-search',
        options: propertyClassifications,
      },
    },
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: PropertyTypeCell as Renderer<CellProps<IProperty, number>>,
    clickable: true,
    responsive: true,
    width: spacing.xsmall,
    minWidth: 60,
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
    clickable: true,
    responsive: true,
    width: spacing.medium,
    minWidth: 100,
    sortable: true,
  },
  {
    Header: 'Location',
    accessor: 'administrativeArea',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: TypeaheadField,
      props: {
        name: 'administrativeArea',
        placeholder: 'Filter by location',
        className: 'location-search',
        options: municipalities.map(mapLookupCode).map((x) => x.label),
        clearButton: true,
        hideValidation: true,
      },
    },
  },
  {
    Header: 'Assessed Building(s)',
    accessor: 'assessedBuilding',
    Cell: !editable
      ? (MoneyCell as Renderer<CellProps<IProperty, number | undefined>>)
      : (props: any) => (
          <EditableMoneyCell
            {...props}
            suppressValidation
            tooltip="Editing financial values will update most recent year only"
          />
        ),
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 100,
    clickable: !editable,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxAssessedValue',
        name: 'maxAssessedValue',
        placeholder: 'Max Assessed value',
        tooltip: 'Filter by max assessed value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Net Book Value',
    accessor: 'netBook',
    Cell: !editable
      ? (MoneyCell as Renderer<CellProps<IProperty, number>>)
      : (props: any) => (
          <EditableMoneyCell
            {...props}
            suppressValidation
            tooltip="Editing financial values will update most recent year only"
          />
        ),
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 100,
    clickable: !editable,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxNetBookValue',
        name: 'maxNetBookValue',
        placeholder: 'Max Net Book Value',
        tooltip: 'Filter by max net book value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Lot Size (in\u00A0ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 120,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      component: Input,
      props: {
        field: 'maxLotSize',
        name: 'maxLotSize',
        placeholder: 'Filter by Lot Size',
        className: 'filter-input-control',
        type: 'number',
      },
    },
  },
  {
    Header: 'Project #',
    width: spacing.xsmall,
    minWidth: 60,
    accessor: 'projectNumbers',
    clickable: false,
    align: 'right',
    Cell: getProjectLinkNoDrafts(),
  },
];
