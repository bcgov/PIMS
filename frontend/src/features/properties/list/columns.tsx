import BuildingSvg from 'assets/images/icon-business.svg';
import LandSvg from 'assets/images/icon-lot.svg';

import React from 'react';
import { Column, CellProps } from 'react-table';
import { Image } from 'react-bootstrap';
import { formatMoney, formatNumber } from 'utils';
import { IProperty } from '.';

// custom typing to be able to place additional configuration on the table column definition
// e.g. align = 'left' | 'right'
type ColumnWithProps<D extends object = {}> = Column<D> & {
  align?: 'left' | 'right';
};

const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);

const NumberCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatNumber(value);

export const columns: ColumnWithProps<IProperty>[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
  },
  {
    Header: 'Property Name',
    accessor: 'description',
    maxWidth: 170,
    align: 'left',
  },
  {
    Header: 'Classification',
    accessor: 'classification',
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
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'left',
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'left',
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: MoneyCell,
    align: 'left',
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    width: 60,
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      const icon = value === 0 ? LandSvg : BuildingSvg;
      return <Image src={icon} />;
    },
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
    width: 80,
    Cell: NumberCell,
  },
];
