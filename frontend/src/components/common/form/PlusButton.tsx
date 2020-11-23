import React from 'react';
import TooltipWrapper from '../TooltipWrapper';
import { FaPlus } from 'react-icons/fa';
import { Button, ButtonProps } from '.';

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
const PlusButton: React.FC<IPlusButtonProps> = ({ toolId, toolText, ...props }) => {
  return (
    <TooltipWrapper toolTipId={toolId} toolTip={toolText}>
      <Button className="primary" {...props} icon={<FaPlus size={20} />} />
    </TooltipWrapper>
  );
};

export default PlusButton;
