import { getMatchingPropertyPin } from '@/components/map/markers/propertyPins';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker } from 'react-leaflet';
import React from 'react';
import { SelectedPropertyIdentifier } from '@/components/map/MapPropertyDetails';

export interface PropertyMarkerProps {
  property: PropertyGeo;
  setSelectedIdentifier: React.Dispatch<React.SetStateAction<SelectedPropertyIdentifier>>;
}

const PropertyMarker = (props: PropertyMarkerProps) => {
  const { property, setSelectedIdentifier } = props;

  return (
    <Marker
      position={[property.Location.y, property.Location.x]}
      icon={getMatchingPropertyPin(property.PropertyTypeId)}
      eventHandlers={{
        click: () => {
          const selectedIdentifer: SelectedPropertyIdentifier = {
            id: property.Id,
            type: property.PropertyTypeId,
          };
          setSelectedIdentifier(selectedIdentifer);
        },
      }}
    >
      {/* Popup can go here */}
    </Marker>
  );
};

export default PropertyMarker;
