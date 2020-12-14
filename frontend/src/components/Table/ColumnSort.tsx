import * as React from 'react';
import { ColumnInstanceWithProps } from '.';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import styled from 'styled-components';

interface IColumnSortProps<T extends object = {}> {
  column: ColumnInstanceWithProps<T>;
  onSort: () => void;
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

const DescIcon = styled(IoMdArrowDropdown)`
  color: #007bff;
`;

const AscIcon = styled(IoMdArrowDropup)`
  color: #007bff;
`;

function ColumnSort<T extends object = {}>({ column, onSort }: IColumnSortProps<T>) {
  if (!column.sortable) {
    return null;
  }

  return (
    <Wrapper onClick={onSort}>
      {column.isSorted && !column.isSortedDesc && <AscIcon />}
      {column.isSorted && column.isSortedDesc && <DescIcon />}

      {!column.isSorted && (
        <>
          <IoMdArrowDropup style={{ marginBottom: -5 }} />
          <IoMdArrowDropdown />
        </>
      )}
    </Wrapper>
  );
}

export default ColumnSort;
