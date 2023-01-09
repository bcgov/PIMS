import './TablePagination.scss';

import React, { PropsWithChildren, ReactElement, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import { TableInstance } from 'react-table';

export type TablePaginationProps<T extends object> = PropsWithChildren<{
  instance: TableInstance<T>;
}>;

const TablePagination = <T extends object>(props: TablePaginationProps<T>): ReactElement | null => {
  const {
    state: { pageIndex, rowCount = props.instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
  } = props.instance;

  const handleChangePage = useCallback(
    (event: { selected: number }) => {
      const newPage = event.selected;
      if (newPage === pageIndex + 1) {
        nextPage();
      } else if (newPage === pageIndex - 1) {
        previousPage();
      } else {
        gotoPage(newPage);
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage],
  );

  // Only set the forcePage prop if it is less than or equal to the pageCount prop
  const forcePage = pageIndex <= pageCount ? pageIndex : undefined;

  return rowCount ? (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handleChangePage}
      // Only set the forcePage prop if it is less than or equal to the pageCount prop
      forcePage={forcePage}
      // css
      activeClassName="active"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
    />
  ) : null;
};

export default TablePagination;
