import './TooltipIcon.scss';

import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';

interface TooltipIconProps extends Partial<React.ComponentPropsWithRef<typeof Overlay>> {
  toolTip?: string;
  toolTipId: string;
  className?: string;
  /** Prop to control the size of the tooltip icon */
  iconSize?: number;
  /** Prop used to pass CSS properties to the tooltip icon */
  style?: CSSProperties;
  /** Prop used to control the placement of the tooltip text on hover */
  placement?: 'top' | 'bottom' | 'right' | 'left';
}

const Icon = React.forwardRef<any>((props: any, ref) => (
  <div ref={ref}>
    <FaInfoCircle
      style={props.style}
      size={props.iconSize}
      className={classNames('tooltip-icon', props.className)}
    />
  </div>
));

const TooltipIcon = (props: TooltipIconProps) => (
  <OverlayTrigger
    placement={props.placement}
    overlay={
      <Tooltip placement={props.placement} id={props.toolTipId}>
        {props.toolTip}
      </Tooltip>
    }
  >
    <div>
      <Icon {...props} />
    </div>
  </OverlayTrigger>
);

export default TooltipIcon;
