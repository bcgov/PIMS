import './Label.scss';

import classNames from 'classnames';
import * as React from 'react';
interface ILabelProps {
  content?: string;
  required?: boolean;
}

/** Generic inline label element */
export const Label: React.FunctionComponent<
  ILabelProps & React.HTMLAttributes<HTMLLabelElement>
> = ({ required, ...rest }) => {
  return (
    <label {...rest} className={classNames('label', rest.className)}>
      {required && <span className="req">*</span>}
      {rest.children}
    </label>
  );
};
