import * as React from 'react';
import { ColumnInstanceWithProps } from '.';
import styled from 'styled-components';
import ClickAwayListener from 'react-click-away-listener';
import { getIn, useFormikContext } from 'formik';
import clsx from 'classnames';
import { FiFilter } from 'react-icons/fi';
import { FaFilter } from 'react-icons/fa';
import variables from '_variables.module.scss';

interface IColumnFilterProps {
  /** Column instance from react table */
  column: ColumnInstanceWithProps<any>;
  /** Handle column filter change */
  onFilter: (values: any) => void;
}

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-items: center;
  position: relative;
  font-size: 12px;
`;

const InputContainer = styled('div')`
  position: absolute;
  bottom: -55px;
  left: 0;
  z-index: 1;
  min-width: 200px;

  .form-control {
    border-radius: 0;
    border-color: ${variables.lightVariantColor};
  }
`;

/**
 * Component to display column filter component, used internally by the table
 */
const ColumnFilter: React.FC<IColumnFilterProps> = ({ column, onFilter, children }) => {
  const [open, setOpen] = React.useState(false);
  const context = useFormikContext();

  const handleClick = () => {
    if (open) {
      onFilter(context.values);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  if (!column.filterable) {
    return <>{children}</>;
  }

  if (!column.filter) {
    throw new Error('Column filter settings are required when the column is filterable.');
  }

  const hasValue = !!getIn(context.values, (column.filter.props || {}).name);
  const Control = column.filter!.component as any;

  return (
    <Wrapper className={clsx('filter-wrapper', { active: hasValue })}>
      {hasValue ? (
        <FaFilter onClick={handleClick} style={{ fontSize: 10, marginRight: 5 }} />
      ) : (
        <FiFilter onClick={handleClick} style={{ fontSize: 10, marginRight: 5 }} />
      )}

      <span onClick={handleClick}>{children}</span>
      {open && (
        <ClickAwayListener onClickAway={handleClick}>
          <InputContainer>
            {(column.filter?.props as any)?.injectFormik ? (
              <Control {...column.filter?.props} formikProps={context} />
            ) : (
              <Control {...column.filter?.props} />
            )}
          </InputContainer>
        </ClickAwayListener>
      )}
    </Wrapper>
  );
};

export default ColumnFilter;
