import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ITabProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The label to display */
  label?: string;
  /** Whether the tab is active */
  active?: boolean;
  /** The path in the url to determine if the tab is active */
  path: string;
  /** Whether the path must match exactly. */
  exact?: boolean;
}

export const Tab: React.FC<ITabProps> = ({
  label,
  active,
  path,
  exact = false,
  className,
  children,
  onClick,
  ...rest
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive =
    active ||
    (!!path && exact && location.pathname === path) ||
    (!exact && location.pathname.startsWith(path));

  const handleClick = !!onClick
    ? onClick
    : () => {
        navigate(path);
      };
  return (
    <li className={className + ' ' + (isActive ? 'active' : '')} onClick={handleClick} {...rest}>
      {label}
      {children}
    </li>
  );
};
