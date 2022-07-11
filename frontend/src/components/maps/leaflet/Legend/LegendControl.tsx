import './LegendControl.scss';

import variables from '_variables.module.scss';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as React from 'react';
import { Button, Overlay, Tooltip } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';
import { FiMapPin } from 'react-icons/fi';
import Control from 'react-leaflet-control';
import styled from 'styled-components';

import { Legend } from './Legend';

const LegendButton = styled(Button)`
  background-color: #ffffff !important;
  color: ${variables.darkVariantColor} !important;
  width: 40px;
  height: 40px;
  font-size: 25px;
  display: flex;
  align-items: center;
`;

export const LegendControl: React.FC = () => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const target = React.useRef(null);

  return (
    <Control position="topleft">
      <ClickAwayListener onClickAway={() => setVisible(false)}>
        <TooltipWrapper toolTipId="marker-legendId" toolTip={visible ? undefined : 'Marker legend'}>
          <LegendButton ref={target} onClick={() => setVisible(!visible)}>
            <FiMapPin />
          </LegendButton>
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
      </ClickAwayListener>
    </Control>
  );
};
