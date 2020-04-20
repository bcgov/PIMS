/**
 * A PagedItem contains a page of items for pageing.
 */
export interface IPagedItems {
  page: number;
  quantity: number;
  total: number;
  items: [];
}
