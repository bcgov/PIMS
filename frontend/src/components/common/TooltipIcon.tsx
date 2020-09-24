import React, { ReactNode } from 'react';
import './TooltipIcon.scss';
import { OverlayTrigger, Tooltip, Overlay } from 'react-bootstrap';
import { FaRegQuestionCircle } from 'react-icons/fa';

interface TooltipIconProps extends Partial<React.ComponentPropsWithRef<typeof Overlay>> {
  toolTip?: string;
  toolTipId: string;
  children?: any;
}

const TooltipIcon = (props: TooltipIconProps) => (
  <OverlayTrigger
    placement={props.placement}
    overlay={<Tooltip id={props.toolTipId}>{props.toolTip}</Tooltip>}
  >
    <FaRegQuestionCircle size={14} className="tooltip-icon" />
  </OverlayTrigger>
);

export default TooltipIcon;
