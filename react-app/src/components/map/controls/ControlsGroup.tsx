import React, { PropsWithChildren } from 'react';

/**
 * Functional component for rendering a group of controls with a specified position on the map.
 * Keeps control elements clustered together.
 * @param props - Props object containing children elements and the position of the controls group.
 * @param props.position - String representing the position of the controls group on the map.
 * @returns JSX element representing the controls group with the specified position.
 */
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
          top: '80px',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default ControlsGroup;
