import React from 'react';
import TooltipWrapper from '../TooltipWrapper';
import { FaUndo } from 'react-icons/fa';
import { Button, ButtonProps } from '.';

/**
 * Button displaying a reset/recycle icon, used to reset form data.
 * @param param0
 */
const ResetButton: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <TooltipWrapper toolTipId="map-filter-reset-tooltip" toolTip="Reset Filter">
      <Button
        id="reset-button"
        type="reset"
        variant="info"
        {...props}
        icon={<FaUndo size={20} />}
      ></Button>
    </TooltipWrapper>
  );
};

export default ResetButton;
