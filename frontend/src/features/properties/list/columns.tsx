import React from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import { formatNumber, mapLookupCode } from 'utils';
import { IProperty } from '.';
import { ColumnWithProps } from 'components/Table';
import { FastCurrencyInput, Input, Select, SelectOption } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { ILookupCode } from 'actions/lookupActions';
import { EditableMoneyCell, MoneyCell, AsterixMoneyCell } from 'components/Table/MoneyCell';
import _ from 'lodash';
import styled from 'styled-components';
import { PropertyTypeCell } from 'components/Table/PropertyTypeCell';
import { PropertyTypes } from 'constants/index';

export const ColumnDiv = styled.div`
  display: flex;
  flex-flow: column;
  padding-right: 5px;
`;

const NumberCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatNumber(value);

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

const getProjectLinkNoDrafts = (namespace: string = 'properties') => (cellInfo: any) => {
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
        options: agencyOptions.map(a => ({ ...a, parentId: a.value })),
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
    clickable: true,
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
    Cell: PropertyTypeCell,
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
        options: municipalities.map(mapLookupCode).map(x => x.label),
        clearButton: true,
        hideValidation: true,
      },
    },
  },
  {
    Header: 'Assessed Land',
    accessor: 'assessedLand',
    Cell: !editable
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
        ? AsterixMoneyCell
        : MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
    Header: 'Market Value',
    accessor: 'market',
    Cell: !editable
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
        field: 'maxMarketValue',
        name: 'maxMarketValue',
        placeholder: 'Max Market Value',
        tooltip: 'Filter by max market value',
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
        options: agencyOptions.map(a => ({ ...a, parentId: a.value })),
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
    clickable: true,
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
    Cell: PropertyTypeCell,
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
        options: municipalities.map(mapLookupCode).map(x => x.label),
        clearButton: true,
        hideValidation: true,
      },
    },
  },
  {
    Header: 'Assessed Building(s)',
    accessor: 'assessedBuilding',
    Cell: !editable
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
    Header: 'Market Value',
    accessor: 'market',
    Cell: !editable
      ? MoneyCell
      : (props: any) => <EditableMoneyCell {...props} suppressValidation />,
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
        field: 'maxMarketValue',
        name: 'maxMarketValue',
        placeholder: 'Max Market Value',
        tooltip: 'Filter by max market value',
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
