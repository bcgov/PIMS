import { getMatchingPropertyPin } from '@/components/map/markers/propertyPins';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker } from 'react-leaflet';
import React, { useContext } from 'react';
import { SelectedPropertyIdentifier } from '@/components/map/MapPropertyDetails';
import { SelectedMarkerContext } from '@/components/map/ParcelMap';
import { ClusterGeo } from '@/components/map/InventoryLayer';
import { LatLngExpression } from 'leaflet';

export interface PropertyMarkerProps {
  property: PropertyGeo & ClusterGeo;
  position?: LatLngExpression;
}

/**
 * Renders a marker for a property on a map.
 *
 * @param {PropertyMarkerProps} props - The properties for the marker.
 * @param {PropertyGeo & ClusterGeo} props.property - The property data.
 * @param {LatLngExpression} [props.position] - The position of the marker.
 * @returns {JSX.Element} The rendered marker component.
 */
const PropertyMarker = (props: PropertyMarkerProps) => {
  const { property } = props;
  const { selectedMarker, setSelectedMarker } = useContext(SelectedMarkerContext);
  return (
    <Marker
      position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]}
      icon={getMatchingPropertyPin(
        property.properties.PropertyTypeId,
        selectedMarker?.id === property.properties.Id &&
          selectedMarker?.type === property.properties.PropertyTypeId,
      )}
      eventHandlers={{
        click: () => {
          const selectedIdentifer: SelectedPropertyIdentifier = {
            id: property.properties.Id,
            type: property.properties.PropertyTypeId,
          };
          setSelectedMarker(selectedIdentifer);
        },
      }}
      {...props}
    >
      {/* Popup can go here */}
    </Marker>
  );
};

export default PropertyMarker;
