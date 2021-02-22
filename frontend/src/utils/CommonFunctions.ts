import { ReactPaginateProps } from 'react-paginate';
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
export const toReactPaginateProps = (props: IPaginate): ReactPaginateProps => {
  const pageNumbers = props.total > props.quantity ? props.total / props.quantity : 1;
  const initialPage = props.page < 1 ? 0 : props.page - 1;
  const actualMaxPages = props.maxPages ?? PAGINATION_MAX_PAGES;
  const pageRangeDisplayed = pageNumbers < actualMaxPages ? pageNumbers : actualMaxPages;
  const reactPaginateProps: ReactPaginateProps = {
    pageCount: pageNumbers,
    marginPagesDisplayed: PAGINATION_MARGIN_PAGES,
    pageRangeDisplayed: pageRangeDisplayed,
    initialPage: initialPage,
    breakClassName: 'page-item',
    breakLinkClassName: 'page-link',
    containerClassName: 'pagination',
    pageClassName: 'page-item',
    pageLinkClassName: 'page-link',
    previousClassName: 'page-item',
    previousLinkClassName: 'page-link',
    nextClassName: 'page-item',
    nextLinkClassName: 'page-link',
    activeClassName: 'active',
    disableInitialCallback: true,
    nextLabel: '>',
    previousLabel: '<',
    forcePage: props.page,
  };
  return reactPaginateProps;
};

export const toApiPaginateParams = (
  page: number,
  quantity?: number,
  sort?: string | string[],
): IPaginateParams => {
  //react-paginate uses 0-based page indexes.
  const apiPaginateParams: IPaginateParams = {
    page: page + 1,
    quantity: quantity,
    sort: sort,
  };
  return apiPaginateParams;
};

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
export const toFilteredApiPaginateParams = <T extends object = {}>(
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
