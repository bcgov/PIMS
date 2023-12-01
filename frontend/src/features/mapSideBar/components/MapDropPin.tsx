/// <reference types="vite-plugin-svgr/client" />

import './MapDropPin.scss';

import BuildingDraftIcon from 'assets/images/draft-building-icon.svg?react';
import ParcelDraftIcon from 'assets/images/draft-parcel-icon.svg?react';
import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';

/**
 * @interface
 * @param {boolean} disabled - A boolean indicating whether the pin button is disabled.
 * @param {Function} setMovingPinNameSpace - A function that sets the namespace of the moving pin.
 * @param {string} nameSpace - A string representing the namespace of the pin.
 * @param {boolean} isBuilding - A boolean indicating whether the pin represents a building.
 * @param {Function} onPinDrop - A callback function to be called when the pin is dropped.
 * @param {boolean} resetNamespace - A boolean indicating whether to reset the namespace of the pin.
 */
interface IMapDropPin {
  setMovingPinNameSpace: (namespace: string | undefined) => void;
  disabled?: boolean;
  nameSpace?: string;
  isBuilding?: boolean;
  onPinDrop?: () => void;
  resetNamespace?: boolean;
}

/**
 * Renders a button with an icon that represents a map drop pin. When the button is clicked, it sets the active state of the pin and calls a callback function. The component also listens for clicks outside of the button to deactivate the pin.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.disabled - A boolean indicating whether the pin button is disabled.
 * @param {Function} props.setMovingPinNameSpace - A function that sets the namespace of the moving pin.
 * @param {string} props.nameSpace - A string representing the namespace of the pin.
 * @param {boolean} props.isBuilding - A boolean indicating whether the pin represents a building.
 * @param {Function} props.onPinDrop - A callback function to be called when the pin is dropped.
 * @param {boolean} props.resetNamespace - A boolean indicating whether to reset the namespace of the pin.
 * @returns {JSX.Element} The rendered MapDropPin component.
 */
const MapDropPin = (props: IMapDropPin) => {
  const { disabled, setMovingPinNameSpace, nameSpace, isBuilding, onPinDrop, resetNamespace } =
    props;

  const [locationPinActive, setLocationPinActive] = useState<boolean>(false);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (locationPinActive) {
          if (onPinDrop) onPinDrop();
          if (resetNamespace) setMovingPinNameSpace(undefined);
          setLocationPinActive(false);
        }
      }}
    >
      <button
        id="draft-marker-button"
        disabled={disabled}
        onClick={(e: any) => {
          e.preventDefault();
          setMovingPinNameSpace(nameSpace ?? '');
          // Pin picked up, set active
          setLocationPinActive(true);
        }}
      >
        {isBuilding ? <BuildingDraftIcon /> : <ParcelDraftIcon className="parcel-icon" />}
      </button>
    </ClickAwayListener>
  );
};

export default MapDropPin;
