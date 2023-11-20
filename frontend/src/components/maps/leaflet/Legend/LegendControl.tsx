import './LegendControl.scss';

import TooltipWrapper from 'components/common/TooltipWrapper';
import ControlPane from 'components/leaflet';
import * as React from 'react';
import { Button, Overlay, Tooltip } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';
import { FiMapPin } from 'react-icons/fi';

import { Legend } from './Legend';

export const LegendControl: React.FC = () => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const target = React.useRef(null);

  return (
    <ControlPane position="topleft">
      <TooltipWrapper toolTipId="marker-legendId" toolTip={visible ? undefined : 'Marker legend'}>
        <ClickAwayListener
          onClickAway={() => {
            setVisible(false);
          }}
        >
          <Button className="legend-button" ref={target} onClick={() => setVisible(!visible)}>
            <FiMapPin />
          </Button>
        </ClickAwayListener>
      </TooltipWrapper>
      <Overlay target={target.current!} show={visible} placement="right">
        {(props: any) => {
          return (
            <Tooltip id="overlay-legend" {...props} show={`${visible}`} className="legendTooltip">
              <Legend />
            </Tooltip>
          );
        }}
      </Overlay>
    </ControlPane>
  );
};
