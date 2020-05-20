import { IdType } from 'react-table';

export type SortDirection = 'desc' | 'asc';

export type TableSort<T extends object> = {
  column: IdType<T>;
  direction: SortDirection;
};
