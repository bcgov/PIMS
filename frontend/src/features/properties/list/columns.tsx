import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import { formatMoney, formatNumber, mapLookupCode } from 'utils';
import { IProperty } from '.';
import { ColumnWithProps } from 'components/Table';
import { ParentGroupedFilter } from 'components/SearchBar/ParentGroupedFilter';
import { FastCurrencyInput, Input, Select, SelectOption } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { ILookupCode } from 'actions/lookupActions';

const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);

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

export const columns = (
  agencyOptions: SelectOption[],
  subAgencies: SelectOption[],
  municipalities: ILookupCode[],
  propertyClassifications: ILookupCode[],
): ColumnWithProps<IProperty>[] => [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 100, // px
    sortable: true,
    filterable: true,
    filter: {
      component: ParentGroupedFilter,
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
    sortable: true,
    filterable: true,
    filter: {
      component: ParentGroupedFilter,
      props: {
        name: 'agencies[1]',
        placeholder: 'Filter by sub agency',
        className: 'agency-search',
        options: subAgencies,
        labelKey: (option: SelectOption) => {
          console.log(option);
          return `${option.label}`;
        },
      },
    },
  },
  {
    Header: 'Property Name',
    accessor: 'name',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    sortable: true,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    sortable: true,
    filterable: true,
    filter: {
      component: Select,
      props: {
        field: 'classificationId',
        name: 'classificationId',
        placeholder: 'Filter by class',
        className: 'location-search',
        options: propertyClassifications.map(mapLookupCode),
      },
    },
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      return value === 0 ? <LandSvg className="svg" /> : <BuildingSvg className="svg" />;
    },
    responsive: true,
    width: spacing.small,
    minWidth: 65,
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
    responsive: true,
    width: spacing.large,
    minWidth: 160,
    sortable: true,
  },
  {
    Header: 'Location',
    accessor: 'administrativeArea',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
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
      },
    },
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxAssessedValue',
        name: 'maxAssessedValue',
        placeholder: 'Filter by assessed',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Net Book Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxNetBookValue',
        name: 'maxNetBookValue',
        placeholder: 'Filter by Net Book',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Market Value',
    accessor: 'market',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
    sortable: true,
    filterable: true,
    filter: {
      component: FastCurrencyInput,
      props: {
        injectFormik: true,
        field: 'maxMarketValue',
        name: 'maxMarketValue',
        placeholder: 'Filter by Market Value',
        className: 'filter-input-control',
      },
    },
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 120,
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
    Header: ' ',
    id: 'view-link-column',
    responsive: true,
    width: spacing.small,
    minWidth: 65,
    accessor: row => {
      // Return the parcel ID associated with this row.
      // For buildings we need the parent `parcelId` property
      const id = row.propertyTypeId === 0 ? row.id : row.parcelId;
      return id ?? -1;
    },
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      if (value > 0) {
        return (
          <Link to={`/mapview/${value}?disabled=true&sidebar=true&loadDraft=false`}>View</Link>
        );
      }
      return null;
    },
  },
];
