import React from 'react';
import { toReactPaginateProps, IPaginate } from 'utils/CommonFunctions';
import ReactPaginate from 'react-paginate';

const WrappedPaginate = (
  props: IPaginate & {
    onPageChange: (selectedItem: { selected: number }) => void;
    pagingRef: any;
  },
) => {
  return props.quantity < props.total && props.total > 0 ? (
    <div ref={props.pagingRef}>
      <ReactPaginate
        {...toReactPaginateProps(props)}
        onPageChange={props.onPageChange}
      ></ReactPaginate>
    </div>
  ) : null;
};
export default WrappedPaginate;
