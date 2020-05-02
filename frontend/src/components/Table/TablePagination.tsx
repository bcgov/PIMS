import './TablePagination.scss';

import React, { useCallback } from 'react';
import { TableInstance } from 'react-table';

export type TablePaginationProps<T extends object> = React.PropsWithChildren<{
  instance: TableInstance<T>;
}>;

export default function TablePagination<T extends object>(
  props: TablePaginationProps<T>,
): React.ReactElement | null {
  const {
    state: { pageIndex, pageSize, rowCount = props.instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = props.instance;

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
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

  const onChangeRowsPerPage = useCallback(
    e => {
      setPageSize(Number(e.target.value));
    },
    [setPageSize],
  );

  return rowCount ? (
    // <MuiTablePagination
    //   rowsPerPageOptions={rowsPerPageOptions}
    //   component="div"
    //   count={rowCount}
    //   rowsPerPage={pageSize}
    //   page={pageIndex}
    //   onChangePage={handleChangePage}
    //   onChangeRowsPerPage={onChangeRowsPerPage}
    // />
    <>BLAH</>
  ) : null;
}
