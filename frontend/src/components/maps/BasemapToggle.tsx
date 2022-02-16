import './BasemapToggle.scss';

import React, { useState } from 'react';

export type BaseLayer = {
  name: string;
  url: string;
  attribution: string;
  thumbnail: string;
};

export type BasemapToggleEvent = {
  current: BaseLayer;
  previous: BaseLayer;
};

type BasemapToggleProps = {
  baseLayers: BaseLayer[];
  onToggle?: (e: BasemapToggleEvent) => void;
};

const BasemapToggle: React.FC<BasemapToggleProps> = (props) => {
  // TODO: fade out when map is panning/zooming
  const [updating] = useState(false);
  const [currentBasemap, secondaryBasemap] = props.baseLayers;

  const toggle = () => {
    const e: BasemapToggleEvent = {
      current: secondaryBasemap,
      previous: currentBasemap,
    };
    props.onToggle?.(e);
  };

  return (
    <div className={updating ? 'basemap-container view-busy' : 'basemap-container'}>
      <button className="basemap-item current"></button>
      <label className="caption">{secondaryBasemap?.name}</label>
      <div className="basemap-item basemap-item-button secondary" onClick={toggle}>
        <img src={secondaryBasemap?.thumbnail} role="presentation" alt="Map Thumbnail" />
      </div>
    </div>
  );
};

export default BasemapToggle;
