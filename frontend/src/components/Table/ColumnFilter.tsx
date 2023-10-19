import variables from '_variables.module.scss';
import clsx from 'classnames';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { getIn, useFormikContext } from 'formik';
import * as React from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { FaFilter } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import styled from 'styled-components';

import { ColumnInstanceWithProps } from '.';

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
  padding: 0 5px;
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
const ColumnFilter: React.FC<React.PropsWithChildren<IColumnFilterProps>> = ({
  column,
  onFilter,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const context = useFormikContext();

  const handleClick = () => {
    if (open) {
      // Some values added if not in existing context. If not specified as empty string, filter doesn't clear.
      onFilter({
        administrativeArea: '',
        classificationId: '',
        ...(context.values as object),
      });
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

  console.log(context.values);
  console.log((column.filter.props || {}).name);
  const hasValue = !!getIn(context.values, (column.filter.props || {}).name);
  const Control = column.filter!.component as any;

  const filter = (
    <Wrapper className={clsx('filter-wrapper', { active: hasValue })}>
      {hasValue ? (
        <FaFilter
          onClick={handleClick}
          style={{ fontSize: 10, margin: '0 5' }}
          id="filter-active"
        />
      ) : (
        <FiFilter
          onClick={handleClick}
          style={{ fontSize: 10, margin: '0 5' }}
          id="filter-inactive"
        />
      )}

      <span onClick={handleClick}>{children}</span>
      {open && (
        <ClickAwayListener onClickAway={handleClick}>
          <InputContainer
            onKeyUp={(e: any) => {
              if (e.keyCode === 13) {
                handleClick();
              }
            }}
          >
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

  if (!(column.filter?.props as any)?.tooltip) {
    return filter;
  }

  return (
    <TooltipWrapper
      toolTipId={`${column.id}-filter`}
      toolTip={(column.filter?.props as any)?.tooltip}
    >
      {filter}
    </TooltipWrapper>
  );
};

export default ColumnFilter;
