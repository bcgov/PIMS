/**
 * A PagedItem contains a page of items for paging.
 */
export interface IPagedItems<T extends object = {}> {
  pageIndex: number; // pageIndex = page - 1 (used by frontend)
  page: number; // page number from API response
  quantity: number;
  total: number;
  items: T[];
}
