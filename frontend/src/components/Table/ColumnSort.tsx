import * as React from 'react';
import { ColumnInstanceWithProps } from '.';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import styled from 'styled-components';
import variables from '_variables.module.scss';

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
  color: ${variables.activeColor};
`;

const AscIcon = styled(IoMdArrowDropup)`
  color: ${variables.activeColor};
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
