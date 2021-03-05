import { ISnapshot } from './interfaces';
import { CellProps } from 'react-table';
import { formatMoney, formatFiscalYear } from 'utils';
import { Input, SelectOption } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';

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

export const columns = (agencyOptions: SelectOption[]): any[] => [
  {
    Header: 'SPP No.',
    accessor: 'project.projectNumber', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 65, // px
    sortable: true,
    filterable: true,
    filter: {
      component: Input,
      props: {
        field: 'projectNumber',
        name: 'projectNumber',
        placeholder: 'Filter by SPP No.',
      },
    },
  },
  {
    Header: 'Fiscal Year',
    accessor: 'project.actualFiscalYear',
    align: 'left',
    responsive: false,
    width: 50,
    minWidth: 50,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatFiscalYear(props?.row?.original?.project?.actualFiscalYear);
    },
    sortable: true,
    filterable: true,
    filter: {
      component: Input,
      props: {
        field: 'fiscalYear',
        name: 'fiscalYear',
        placeholder: 'Filter by Fiscal year.',
        injectFormik: true,
      },
    },
  },
  {
    Header: 'Agency',
    accessor: 'project.agencyName',
    align: 'left',
    responsive: false,
    width: 55,
    minWidth: 55,
    sortable: true,
    filterable: true,
    filter: {
      component: ParentSelect,
      props: {
        field: 'agency',
        name: 'agency',
        options: agencyOptions,
        placeholder: 'Filter by agency',
        filterBy: ['code', 'label', 'parent'],
        convertValue: Number,
      },
    },
  },
  {
    Header: 'Name',
    accessor: 'project.name',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Risk',
    accessor: 'project.risk',
    align: 'left',
    responsive: true,
    width: spacing.xsmall,
    minWidth: 55,
  },
  {
    Header: 'Status',
    accessor: 'project.status.name',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
  },
  {
    Header: 'CMV',
    accessor: 'market',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.market);
    },
  },
  {
    Header: 'NBV',
    accessor: 'netBook',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.netBook);
    },
  },
  {
    Header: 'Sales Cost',
    accessor: 'salesCost',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.salesCost);
    },
  },
  {
    Header: 'Program Cost',
    accessor: 'programCost',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.programCost);
    },
  },
  {
    Header: 'Gain Loss',
    accessor: 'gainLoss',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.gainLoss);
    },
  },
  {
    Header: 'OCG Fin. Stmts.',
    accessor: 'ocgFinancialStatements',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.ocgFinancialStatement);
    },
  },
  {
    Header: 'Interest Comp.',
    accessor: 'interestComponent',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.interestComponent);
    },
  },
  {
    Header: 'Net Proceeds',
    accessor: 'netProceeds',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.netProceeds);
    },
  },
  {
    Header: 'Baseline Integrity',
    accessor: 'baselineIntegrity',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.baselineIntegrity);
    },
  },
];
