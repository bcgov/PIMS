import * as React from 'react';
import { Tooltip, OverlayTrigger, OverlayTriggerProps } from 'react-bootstrap';

interface ITooltipWrapperProps extends Partial<OverlayTriggerProps> {
  toolTip?: string;
  toolTipId: string;
}

/**
 * Wrap whatever you want in a tooltip.
 * @param props ITooltipWrapperProps
 */
const TooltipWrapper: React.FunctionComponent<ITooltipWrapperProps> = props => {
  return (
    <>
      <OverlayTrigger {...props} overlay={<Tooltip id={props.toolTipId}>{props.toolTip}</Tooltip>}>
        {props.children}
      </OverlayTrigger>
    </>
  );
};

export default TooltipWrapper;
