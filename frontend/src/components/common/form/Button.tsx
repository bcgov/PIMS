import './Button.scss';

import classnames from 'classnames';
import { rest } from 'lodash';
import React, { CSSProperties, forwardRef, MouseEventHandler } from 'react';
import { Button as ButtonBase, ButtonProps as ButtonPropsBase, Spinner } from 'react-bootstrap';

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
  /** Display a spinner when the form is being submitted */
  showSubmitting?: boolean;
  /** if true and showSubmitting is true, display the spinner */
  isSubmitting?: boolean;
};

export const Button: React.FC<ButtonProps & React.HTMLAttributes<HTMLButtonElement>> = forwardRef(
  (props, ref) => {
    const classes = classnames({
      Button: true,
      'Button--disabled': props.disabled,
      'Button--icon-only': (props.children === null || props.children === undefined) && props.icon,
      [props.className!]: props.className,
    });
    return (
      <ButtonBase className={classes} disabled={props.disabled} {...rest}>
        {props.icon && <div className="Button__icon">{props.icon}</div>}
        {props.children && <div className="Button__value">{props.children}</div>}
        {props.showSubmitting && props.isSubmitting && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            as="span"
            style={{ marginLeft: '.5rem', padding: '.5rem' }}
          />
        )}
      </ButtonBase>
    );
  },
);
