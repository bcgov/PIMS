import { CellProps } from 'react-table';
import { formatNumber } from 'utils';
import { ColumnWithProps, ViewPropertyCell, MoneyCell } from 'components/Table';
import { IProperty } from '../../common/interfaces';
import { PropertyTypeCell } from 'components/Table/PropertyTypeCell';

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
    accessor: row => (row.subAgency ? `${row.subAgency} (${row.agencyCode})` : row.agencyCode), // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 65, // px
  },
  {
    Header: 'Name/PID',
    accessor: row => (row.name ? `${row.name} ${row.pid}` : row.pid ?? row.pin),
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
    Header: 'Street Address',
    accessor: row => `${row.address}, ${row.administrativeArea}`,
    align: 'left',
    responsive: true,
    width: spacing.large,
    minWidth: 160,
  },
  {
    Header: 'Zoning',
    accessor: 'zoning',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
  },
  {
    Header: 'Zoning Potential',
    accessor: 'zoningPotential',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessedLand',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Net Book Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Market Value',
    accessor: 'market',
    Cell: MoneyCell,
    align: 'right',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: PropertyTypeCell,
    responsive: true,
    width: spacing.small,
    minWidth: 65,
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
    Cell: ViewPropertyCell,
  },
];
