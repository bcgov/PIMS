import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import { formatMoney, formatNumber } from 'utils';
import { IProperty } from '.';
import { ColumnWithProps } from 'components/Table';

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

export const columns: ColumnWithProps<IProperty>[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 65, // px
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Property Name',
    accessor: 'description',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
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
  },
  {
    Header: 'Location',
    accessor: 'administrativeArea',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    align: 'right',
    responsive: true,
    width: spacing.small,
    minWidth: 65,
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
