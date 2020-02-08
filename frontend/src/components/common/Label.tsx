import * as React from 'react';
import './Label.scss';
interface ILabelProps {
    children?:string
}

/** generic inline label element */
export const Label = (props: ILabelProps | null | undefined) => {
  return <p className="label">{props?.children}</p>;
}
