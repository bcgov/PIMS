import React, { PropsWithChildren } from 'react';

const ControlsGroup = (props: PropsWithChildren & { position: string }) => {
  const { position } = props;
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  };
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  return (
    <div className={positionClass}>
      <div
        className={`leaflet-control leaflet-bar`}
        style={{
          position: 'absolute',
          top: '140px',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default ControlsGroup;
