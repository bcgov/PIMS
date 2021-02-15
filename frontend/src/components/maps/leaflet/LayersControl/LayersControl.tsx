import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FaLayerGroup } from 'react-icons/fa';
import Control from 'react-leaflet-control';
import styled from 'styled-components';
import clsx from 'classnames';
import LayersTree from './LayersTree';
import * as L from 'leaflet';
import { useEffect } from 'react';
import TooltipWrapper from 'components/common/TooltipWrapper';
import variables from '_variables.module.scss';

const LayersContainer = styled.div`
  margin-right: -10px;
  width: 341px;
  min-height: 52px;
  height: 500px;
  max-height: 500px;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &.closed {
    width: 0px;
    height: 0px;
  }
`;

const LayersHeader = styled.div`
  width: 100%;
  height: 80px;
  background-color: ${variables.slideOutBlue};
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 16px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const LayersContent = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  padding: 16px;

  &.open {
    overflow-y: scroll;
  }
`;

const LayersIcon = styled(FaLayerGroup)`
  font-size: 30px;
`;

const Title = styled.p`
  font-size: 18px;
  color: #ffffff;
  text-decoration: none solid rgb(255, 255, 255);
  line-height: 18px;
  font-weight: bold;
`;

const ControlButton = styled(Button)`
  width: 52px;
  height: 52px;
  position: absolute;
  top: 0;
  left: -51px;
  background-color: #fff;
  color: ${variables.slideOutBlue};
  border-color: ${variables.slideOutBlue};
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  &.open {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: 26px;
  }
`;

export type ILayersControl = {
  /** whether the slide out is open or closed */
  open: boolean;
  /** set the slide out as open or closed */
  setOpen: () => void;
};

/**
 * Component to display the layers control on the map
 * @example ./LayersControl.md
 */
const LayersControl: React.FC<ILayersControl> = ({ open, setOpen }) => {
  useEffect(() => {
    const elem = L.DomUtil.get('layersContainer');
    if (elem) {
      L.DomEvent.on(elem!, 'mousewheel', L.DomEvent.stopPropagation);
    }
  });

  return (
    <Control position="topright">
      <LayersContainer id="layersContainer" className={clsx({ closed: !open })}>
        {open && (
          <LayersHeader>
            <LayersIcon />
            <Title>Layers</Title>
          </LayersHeader>
        )}
        <TooltipWrapper toolTipId="layer-control-id" toolTip="Layer Controls">
          <ControlButton
            id="layersControlButton"
            variant="outline-secondary"
            onClick={setOpen}
            className={clsx({ open })}
          >
            <LayersIcon />
          </ControlButton>
        </TooltipWrapper>
        <LayersContent className={clsx({ open })}>
          <LayersTree />
        </LayersContent>
      </LayersContainer>
    </Control>
  );
};

export default LayersControl;
