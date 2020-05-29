import { Column, ColumnInstance, Cell } from 'react-table';

// Mixed bag of optional properties to supply to the ColumnDefinitions below
// NOTE - make sure you all properties below are optional!
interface IExtraColumnProps {
  align?: 'left' | 'right';
  clickable?: boolean;
  sortable?: boolean;
  // Whether to use width percentages vs hard-coded widths in pixels. Percentages support responsive design.
  responsive?: boolean;
  expandable?: boolean;
}

// Typings for configuration sent to `react-table`
export type ColumnWithProps<D extends object = {}> = Column<D> & IExtraColumnProps;

// Typings for object instances - as returned by `react-table`
export type ColumnInstanceWithProps<D extends object = {}> = ColumnInstance<D> & IExtraColumnProps;
export type CellWithProps<D extends object = {}> = Cell<D> & { column: ColumnInstanceWithProps<D> };
