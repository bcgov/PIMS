/**
 * A PagedItem contains a page of items for paging.
 */
export interface IPagedItems<T extends object = {}> {
  page: number;
  quantity: number;
  total: number;
  items: T[];
}
