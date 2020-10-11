import * as React from 'react';
import { Overlay, Tooltip, OverlayTrigger } from 'react-bootstrap';

interface ITooltipWrapperProps extends Partial<React.ComponentPropsWithRef<typeof Overlay>> {
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
      <OverlayTrigger
        placement={props.placement}
        overlay={<Tooltip id={props.toolTipId}>{props.toolTip}</Tooltip>}
      >
        {props.children}
      </OverlayTrigger>
    </>
  );
};

export default TooltipWrapper;
