import React from 'react';
import { FaPlus } from 'react-icons/fa';

import TooltipWrapper from '../TooltipWrapper';
import { ButtonProps } from '.';

interface IPlusButtonProps extends ButtonProps {
  /** set the text of the tooltip that appears on hover of the plus button */
  toolText: string;
  /** set the id of the tool tip use for on hover of the plus buttons */
  toolId: string;
}

/**
 * PlusButton displaying a plus button, used to add new items.
 * @param param0
 */
const PlusButton: React.FC<IPlusButtonProps> = (props) => {
  const disabled = props.disabled || false;
  return (
    <TooltipWrapper toolTipId={props.toolId} toolTip={props.toolText}>
      <div className="primary" onClick={disabled ? () => {} : props.onClick}>
        <FaPlus size={20} />
      </div>
    </TooltipWrapper>
  );
};

export default PlusButton;
