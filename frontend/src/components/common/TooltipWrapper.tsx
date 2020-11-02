import * as React from 'react';
import { Tooltip, OverlayTrigger, OverlayTriggerProps } from 'react-bootstrap';

/**
 * TooltipWrapper properties.
 * @interface ITooltipWrapperProps
 * @extends {Partial<OverlayTriggerProps>}
 */
interface ITooltipWrapperProps extends Partial<OverlayTriggerProps> {
  /**
   * The tooltip text to display when hovering over the component.
   *
   * @type {string}
   * @memberof ITooltipWrapperProps
   */
  toolTip?: string; // TODO: Rename 'toolTip' with 'tooltip'
  /**
   * The tooltip element 'id'.
   *
   * @type {string}
   * @memberof ITooltipWrapperProps
   */
  toolTipId: string; // TODO: Rename 'toolTipId' with 'tooltipId'
}

/**
 * Wrap whatever you want in a tooltip.
 * @param props ITooltipWrapperProps
 */
const TooltipWrapper: React.FunctionComponent<ITooltipWrapperProps> = props => {
  return (
    <>
      {props.toolTip?.length ? (
        <OverlayTrigger
          {...props}
          overlay={<Tooltip id={props.toolTipId}>{props.toolTip}</Tooltip>}
        >
          {props.children}
        </OverlayTrigger>
      ) : (
        props.children
      )}
    </>
  );
};

export default TooltipWrapper;
