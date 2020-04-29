import './Button.scss';

import React, { CSSProperties, MouseEventHandler } from 'react';
import { Button as ButtonBase, ButtonProps as ButtonPropsBase } from 'react-bootstrap';
import classnames from 'classnames';

export type ButtonProps = ButtonPropsBase & {
  /** Adds a custom class to the button element of the <Button> component */
  className?: string;
  /** Allow for direct style overrides */
  style?: CSSProperties;
  /** Sets an icon before the text. Can be any icon from Evergreen or a custom element. */
  icon?: React.ReactNode;
  /** When true, the button is disabled. isLoading also sets the button to disabled. */
  disabled?: boolean;
  /** Button click handler */
  onClick?: MouseEventHandler<any>;
};

export const Button: React.FC<ButtonProps> = ({ disabled, icon, children, className, ...rest }) => {
  const classes = classnames({
    Button: true,
    'Button--disabled': disabled,
    'Button--icon-only': (children === null || children === undefined) && icon,
    [className!]: className,
  });
  return (
    <ButtonBase className={classes} {...rest}>
      {icon && <div className="Button__icon">{icon}</div>}
      {children && <div className="Button__value">{children}</div>}
    </ButtonBase>
  );
};
