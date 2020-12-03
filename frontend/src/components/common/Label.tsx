import * as React from 'react';
import './Label.scss';
interface ILabelProps {
  children?: string;
  required?: boolean;
}

/** generic inline label element */
export const Label = (props: ILabelProps | null | undefined) => {
  return (
    <p className="label">
      {props?.required && <span className="req">*</span>}
      {props?.children}
    </p>
  );
};
