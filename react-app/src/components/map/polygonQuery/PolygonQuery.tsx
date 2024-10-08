import React, { Dispatch, SetStateAction } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

interface PolygonQueryProps {
  setPolygons: Dispatch<SetStateAction<LeafletMultiPolygon>>;
  setMapEventsDisabled: Dispatch<SetStateAction<boolean>>;
}

export interface LeafletMultiPolygon {
  leafletIds: number[];
  coordinates: { lat: number; lng: number }[][];
  type: 'MultiPolygon';
}

const PolygonQuery = (props: PolygonQueryProps) => {
  const { setPolygons, setMapEventsDisabled } = props;

  return (
    <FeatureGroup>
      <EditControl
        draw={{
          polygon: true,
          rectangle: false,
          circle: false,
          polyline: false,
          circlemarker: false,
          marker: false,
        }}
        position="bottomleft"
        onCreated={(e) => {
          // When a shape is finished being drawn
          // Set values for map to use in query
          setPolygons((original) => ({
            ...original,
            coordinates: original.coordinates.concat(e.layer._latlngs),
            leafletIds: original.leafletIds.concat(e.layer._leaflet_id),
          }));
        }}
        onDrawStart={() => {
          // When draw tool is initially clicked
          // Prevent other map interactions
          setMapEventsDisabled(true);
        }}
        onDrawStop={() => {
          // When drawing is completed or cancelled
          // Allow other map interactions
          setMapEventsDisabled(false);
        }}
        onEdited={(e) => {
          // Only the polygons edited are in the e.layers object
          // They each have a _leaflet_id which is unique and an array of _latlngs
          // Use the IDs to splice in to the existing array of polygons
          setPolygons((original) => {
            const replacementCoordinates = original.coordinates;
            e.layers.eachLayer((layer) => {
              // Find the index of the original polygon
              const originalIndex = original.leafletIds.findIndex((id) => id === layer._leaflet_id);
              // Use original index to replace with new coordinates
              replacementCoordinates[originalIndex] = (
                layer._latlngs as [[{ lat: number; lng: number }]]
              )[0];
            });
            return {
              ...original,
              coordinates: replacementCoordinates,
            };
          });
        }}
        onEditStart={() => setMapEventsDisabled(true)}
        onEditStop={() => setMapEventsDisabled(false)}
        onDeleted={(e) => {
          setPolygons((original) => {
            const replacementCoordinates = original.coordinates;
            const replacementIds = original.leafletIds;
            e.layers.eachLayer((layer) => {
              // Find the index of the original polygon
              const originalIndex = original.leafletIds.findIndex((id) => id === layer._leaflet_id);
              // Use original index to remove coordinate set
              // Must not accept -1 from findIndex or it will remove last element
              if (originalIndex >= 0) {
                // These calls affect the array directly. They would return the removed elements if assigned.
                replacementCoordinates.splice(originalIndex, 1);
                replacementIds.splice(originalIndex, 1);
              }
            });
            return {
              ...original,
              coordinates: replacementCoordinates,
              leafletIds: replacementIds,
            };
          });
          setMapEventsDisabled(false);
        }}
        onDeleteStart={() => setMapEventsDisabled(true)}
        onDeleteStop={() => setMapEventsDisabled(false)}
      />
    </FeatureGroup>
  );
};

export default PolygonQuery;
