import React from 'react';

import TooltipWrapper from '../TooltipWrapper';
import { ButtonProps } from '.';

interface IStringButtonProps extends ButtonProps {
  /** set the text of the tooltip that appears on hover of the string button */
  toolText: string;
  /** set the id of the tool tip use for on hover of the string buttons */
  toolId: string;
  /** set the string that will be displayed */
  stringText: string;
}

/**
 * StringButton displaying a plus button, used to add new items.
 * @param param0
 */
const StringButton: React.FC<IStringButtonProps> = (props) => {
  const disabled = props.disabled || false;
  const stringText = props.stringText || '';
  return (
    <TooltipWrapper toolTipId={props.toolId} toolTip={props.toolText}>
      <div style={{ color: 'black' }} onClick={disabled ? () => {} : props.onClick}>
        {stringText}
      </div>
    </TooltipWrapper>
  );
};

export default StringButton;
