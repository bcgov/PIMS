import BuildingSvg from 'assets/images/icon-business.svg';
import LandSvg from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { Image } from 'react-bootstrap';
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

// Setup a few sample widths: x/2, 1x, 2x
const x = Math.floor(totalWidthPercent / howManyColumns);
const Sizes = {
  SM: {
    width: x / 2, // percent
    minWidth: 65, // px
  },
  MD: {
    width: x, // percent
    minWidth: 80, // px
  },
  LG: {
    width: 2 * x, // percent
    minWidth: 160, // px
  },
};

export const columns: ColumnWithProps<IProperty>[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.SM.width,
    minWidth: Sizes.SM.minWidth,
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Property Name',
    accessor: 'description',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.LG.width,
    minWidth: Sizes.LG.minWidth,
  },
  {
    Header: 'City',
    accessor: 'city',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Municipality',
    accessor: 'municipality',
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: MoneyCell,
    align: 'left',
    useWidthPercentage: true,
    width: Sizes.MD.width,
    minWidth: Sizes.MD.minWidth,
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      const icon = value === 0 ? LandSvg : BuildingSvg;
      return <Image src={icon} />;
    },
    useWidthPercentage: true,
    width: Sizes.SM.width,
    minWidth: Sizes.SM.minWidth,
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    useWidthPercentage: true,
    width: Sizes.SM.width,
    minWidth: Sizes.SM.minWidth,
  },
  {
    Header: ' ',
    id: 'view-link-column',
    // return the parcel ID associated with this row
    // for buildings we need the parent `parcelId` property
    accessor: row => {
      const id = row.propertyTypeId === 0 ? row.id : row.parcelId;
      return id ?? -1;
    },
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      if (value > 0) {
        return <Link to={`/submitProperty/${value}?disabled=true`}>View</Link>;
      }
      return null;
    },
    useWidthPercentage: true,
    width: Sizes.SM.width,
    minWidth: Sizes.SM.minWidth,
  },
];
