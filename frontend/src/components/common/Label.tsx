import * as React from 'react';
import './Label.scss';
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
    <p {...rest} className={`label ${rest.className}`}>
      {required && <span className="req">*</span>}
      {rest.children}
    </p>
  );
};
