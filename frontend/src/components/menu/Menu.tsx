import './Menu.scss';

import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';

export interface IMenuItemProps {
  label: string | number;
  value?: string | number;
  disabled?: boolean;
  onClick?: (value?: string | number) => void;
}

export const MenuItem = (props: IMenuItemProps) => {
  const ref = React.useRef(null);

  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.value);
    }
  };

  return (
    <ListGroup.Item ref={ref} disabled={props.disabled} className="Menu-item" onClick={onClick}>
      {props.label}
    </ListGroup.Item>
  );
};

interface IProps {
  label?: ReactNode;
  options: IMenuItemProps[];
  width?: string;
  enableFilter?: boolean; // hide or show the menu items filter
  searchPlaceholder?: string;
  alignLeft?: boolean;
  alignTop?: boolean;
  disableScroll?: boolean;
  disableScrollToMenuElement?: boolean;
}

export const Menu: React.FC<React.PropsWithChildren<IProps>> = ({
  label,
  options,
  width,
  enableFilter: filter,
  searchPlaceholder,
  children,
  alignLeft,
  alignTop,
  disableScroll,
  disableScrollToMenuElement,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [filterText, setFilterText] = React.useState('');

  const handleMenuOptionClick = (option: IMenuItemProps) => {
    if (option.onClick) {
      option.onClick();
    }
    setOpen(false);
  };

  const handleFilterTextChange = (event: any) => {
    setFilterText(event.target.value);
  };

  const handleOpenClick = () => {
    setOpen(!open);
    if (ref.current !== null && !disableScrollToMenuElement) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems =
    !filter || !filterText
      ? options
      : options.filter((option) =>
          (option.label as string).toLowerCase().includes(filterText.toLowerCase()),
        );

  const menuWidth = width || '100px';
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="Menu-root">
        <div className="Menu-button" ref={ref} onClick={() => handleOpenClick()}>
          {children || <span>{label || 'Menu'}</span>}
        </div>
        <div
          className={classNames('Menu-items', { open, left: alignLeft, top: alignTop })}
          style={{ width: menuWidth }}
        >
          {filter && (
            <Form.Control
              style={{ width: `calc(${menuWidth} - 10px)` }}
              className="Menu-filter"
              onChange={handleFilterTextChange}
              size="sm"
              type="search"
              placeholder={searchPlaceholder || 'Filter'}
            />
          )}
          <ListGroup className={classNames('Menu-options', { scrollable: !disableScroll })}>
            {menuItems.map((option: IMenuItemProps, index: number) => (
              <MenuItem
                key={index}
                disabled={option.disabled}
                label={option.label}
                onClick={() => handleMenuOptionClick(option)}
              />
            ))}
          </ListGroup>
        </div>
      </div>
    </ClickAwayListener>
  );
};
