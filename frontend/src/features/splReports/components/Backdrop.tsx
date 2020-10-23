import * as React from 'react';
import './Backdrop.scss';

interface IBackdropProps {
  show: boolean;
  onClick: any;
}

/**
 * Provides a generic floating backdrop alpha layer that hides itself when clicked.
 */
const Backdrop: React.FunctionComponent<IBackdropProps> = ({ show, onClick }) => {
  return show ? <div className="backdrop" onClick={onClick}></div> : null;
};

export default Backdrop;
