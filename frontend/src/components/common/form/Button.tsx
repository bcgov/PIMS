import React from 'react';
import { Button as ButtonBase, ButtonProps as ButtonPropsBase } from 'react-bootstrap';

export type ButtonProps = ButtonPropsBase & {
  /** Adds a custom class to the button element of the <Button> component */
  className?: string;
  /** Sets an icon before the text. Can be any icon from Evergreen or a custom element. */
  iconBefore?: React.ReactNode;
  /** Sets an icon after the text. Can be any icon from Evergreen or a custom element. */
  iconAfter?: React.ReactNode;
  /** When true, the button is disabled. isLoading also sets the button to disabled. */
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  disabled,
  iconBefore,
  iconAfter,
  children,
  ...rest
}) => {
  return (
    <ButtonBase {...rest}>
      {iconBefore || null}
      {children}
      {iconAfter || null}
    </ButtonBase>
  );
};
