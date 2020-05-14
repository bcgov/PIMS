import { Column, ColumnInstance, Cell } from 'react-table';

interface IClickableCell {
  clickable?: boolean;
}
export type ClickableColumnInstance<D extends object = {}> = ColumnInstance<D> & IClickableCell;

export type ClickableCell<D extends object = {}> = Cell<D> & { column: ClickableColumnInstance<D> };

export type ColumnWithProps<D extends object = {}> = Column<D> & {
  align?: 'left' | 'right';
} & IClickableCell;
