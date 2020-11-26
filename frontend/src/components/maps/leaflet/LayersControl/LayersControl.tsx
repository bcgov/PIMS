import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FaLayerGroup } from 'react-icons/fa';
import Control from 'react-leaflet-control';
import styled from 'styled-components';
import clsx from 'classnames';
import LayersTree from './LayersTree';

const LayersContainer = styled.div`
  margin-right: -10px;
  width: 341px;
  min-height: 52px;
  height: 500px;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);

  &.closed {
    width: 0px;
    height: 0px;
  }
`;

const LayersHeader = styled.div`
  width: 100%;
  height: 80px;
  background-color: #1a5a96;
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
  color: #1a5a96;
  border-color: #1a5a96;
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  &.open {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: 26px;
  }
`;

/**
 * Component to display the layers control on the map
 * @example ./LayersControl.md
 */
const LayersControl: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Control position="topright">
      <LayersContainer className={clsx({ closed: !open })}>
        {open && (
          <LayersHeader>
            <LayersIcon />
            <Title>Layers</Title>
          </LayersHeader>
        )}
        <ControlButton
          variant="outline-secondary"
          onClick={() => setOpen(!open)}
          className={clsx({ open })}
        >
          <LayersIcon />
        </ControlButton>
        {open && (
          <LayersContent>
            <LayersTree />
          </LayersContent>
        )}
      </LayersContainer>
    </Control>
  );
};

export default LayersControl;
