/**
 * A PagedItem contains a page of items for pageing.
 */
export interface IPagedItems<T> {
  page: number;
  quantity: number;
  total: number;
  items: T[];
}
