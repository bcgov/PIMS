import React from 'react';
import { Column, CellProps } from 'react-table';
import { Image } from 'react-bootstrap';
import BuildingSvg from 'assets/images/icon-business.svg';
import LandSvg from 'assets/images/icon-lot.svg';
import { IProperty } from '.';

export const columns: Column<IProperty>[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
  },
  {
    Header: 'Property Name',
    accessor: 'description',
  },
  {
    Header: 'Classification',
    accessor: 'classification',
  },
  {
    Header: 'Street Address',
    accessor: 'address',
  },
  {
    Header: 'City',
    accessor: 'city',
  },
  {
    Header: 'Municipality',
    accessor: 'municipality',
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    // Cell: ({ cell: { value } }) => <Image src={BuildingSvg} />,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      const icon = value === 0 ? LandSvg : BuildingSvg;
      return <Image src={icon} />;
    },
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
  },
];
