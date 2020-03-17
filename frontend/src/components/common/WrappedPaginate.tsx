import React from 'react';
import { toReactPaginateProps, IPaginate } from 'utils/CommonFunctions';
import ReactPaginate from 'react-paginate';

const WrappedPaginate = (
  props: IPaginate & {
    onPageChange: (selectedItem: { selected: number }) => void;
  },
) => {
  return props.quantity < props.total && props.total > 0 ? (
    <ReactPaginate
      {...toReactPaginateProps(props)}
      onPageChange={props.onPageChange}
    ></ReactPaginate>
  ) : null;
};
export default WrappedPaginate;
