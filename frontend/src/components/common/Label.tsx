import * as React from 'react';
import './Label.scss';
import classNames from 'classnames';
interface ILabelProps {
  content?: string;
  required?: boolean;
}

/** Generic inline label element */
export const Label: React.FunctionComponent<ILabelProps & React.HTMLAttributes<HTMLDivElement>> = ({
  required,
  ...rest
}) => {
  return (
    <p {...rest} className={classNames('label', rest.className)}>
      {required && <span className="req">*</span>}
      {rest.children}
    </p>
  );
};
