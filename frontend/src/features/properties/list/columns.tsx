import BuildingSvg from 'assets/images/icon-business.svg';
import LandSvg from 'assets/images/icon-lot.svg';

import React from 'react';
import { Column, CellProps } from 'react-table';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    width: 65,
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
    width: 120,
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
    width: 65,
  },
  {
    Header: 'Municipality',
    accessor: 'municipality',
    align: 'left',
    width: 95,
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'left',
    width: 100,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'left',
    width: 100,
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: MoneyCell,
    align: 'left',
    width: 100,
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    width: 50,
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
  {
    Header: '',
    width: 65,
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
  },
];
