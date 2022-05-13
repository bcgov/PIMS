export interface IPageModel<T> {
  items: T[];
  page: number;
  quantity: number;
  total: number;
}
