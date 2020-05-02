import { Column } from 'react-table';
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
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
  },
];
