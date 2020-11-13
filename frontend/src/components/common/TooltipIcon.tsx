import React from 'react';
import './TooltipIcon.scss';
import { OverlayTrigger, Tooltip, Overlay } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import classNames from 'classnames';

interface TooltipIconProps extends Partial<React.ComponentPropsWithRef<typeof Overlay>> {
  toolTip?: string;
  toolTipId: string;
  className?: string;
}

const TooltipIcon = (props: TooltipIconProps) => (
  <OverlayTrigger
    placement={props.placement}
    overlay={<Tooltip id={props.toolTipId}>{props.toolTip}</Tooltip>}
  >
    <FaInfoCircle className={classNames('tooltip-icon', props.className)} />
  </OverlayTrigger>
);

export default TooltipIcon;
