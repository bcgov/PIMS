import React, { ReactNode } from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import classNames from 'classnames';
import ClickAwayListener from 'react-click-away-listener';
import './Menu.scss';

export interface IMenuItemProps {
  label: string | number;
  value?: string | number;
  disabled?: boolean;
  onClick?: (value?: string | number) => void;
}

export const MenuItem = (props: IMenuItemProps) => {
  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.value);
    }
  };

  return (
    <ListGroup.Item disabled={props.disabled} className="Menu-item" onClick={onClick}>
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
}

export const Menu: React.FC<IProps> = ({
  label,
  options,
  width,
  enableFilter: filter,
  searchPlaceholder,
  children,
}) => {
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

  const menuItems =
    !filter || !filterText
      ? options
      : options.filter(option =>
          (option.label as string).toLowerCase().includes(filterText.toLowerCase()),
        );

  const menuWidth = width || '100px';
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="Menu-root">
        <div className="Menu-button" onClick={() => setOpen(!open)}>
          {children || <span>{label || 'Menu'}</span>}
        </div>
        <div className={classNames('Menu-items', { open })} style={{ width: menuWidth }}>
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
          <ListGroup className="Menu-options">
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
