import { IPaginateParams } from 'constants/API';

export interface IPaginate {
  page: number;
  total: number;
  quantity: number;
  items: any;
  maxPages?: number;
}
export const PAGINATION_MARGIN_PAGES = 3;
export const PAGINATION_MAX_PAGES = 9;

/**
 * Converts the filter into a paginated filter.
 *
 * @template T
 * @param {number} page
 * @param {number} [quantity]
 * @param {(string | string[])} [sort]
 * @param {T} [filter]
 * @returns {IPaginateParams}
 */
export const toFilteredApiPaginateParams = <T extends object>(
  page: number,
  quantity?: number,
  sort?: string | string[],
  filter?: T,
): IPaginateParams => {
  const apiPaginateParams: IPaginateParams = {
    page: page + 1,
    quantity: quantity,
    sort: sort,
    ...filter,
  };
  return apiPaginateParams;
};
