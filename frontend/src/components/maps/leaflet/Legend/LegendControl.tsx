import * as React from 'react';
import Control from 'react-leaflet-control';
import { Overlay, Tooltip, Button } from 'react-bootstrap';
import './LegendControl.scss';
import ClickAwayListener from 'react-click-away-listener';
import { Legend } from './Legend';
import styled from 'styled-components';
import { FiMapPin } from 'react-icons/fi';

const LegendButton = styled(Button)`
  background-color: #ffffff !important;
  color: #121212 !important;
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
        <LegendButton ref={target} onClick={() => setVisible(!visible)}>
          <FiMapPin />
        </LegendButton>
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
