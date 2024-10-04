import { MultiPolygon } from 'geojson';
import React, { Dispatch, SetStateAction } from 'react';
import { FeatureGroup, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

interface PolygonQueryProps {
  polygons: MultiPolygon;
  setPolygons: Dispatch<SetStateAction<MultiPolygon>>;
  setMapEventsDisabled: Dispatch<SetStateAction<boolean>>;
}

const PolygonQuery = (props: PolygonQueryProps) => {
  const { polygons, setPolygons, setMapEventsDisabled } = props;

  return (
    <FeatureGroup>
      <Popup>hi</Popup>
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
          console.log('created', e.layer._parts);
          console.log('old polygon', polygons.coordinates);
          setPolygons((original) => ({
            type: 'MultiPolygon',
            coordinates: original.coordinates.concat(e.layer._parts),
          }));
        }}
        onDrawStart={() => {
          // When draw tool is initially clicked
          // Prevent other map interactions
          console.log('draw start');
          setMapEventsDisabled(true);
        }}
        onDrawStop={() => {
          // When drawing is completed or cancelled
          // Allow other map interactions
          console.log('draw stop');
          setMapEventsDisabled(false);
        }}
        onEdited={() => {
          // Find the shape that was just edited by matching points
          // Splice the new shape in that position.
        }}
        onEditStart={() => setMapEventsDisabled(true)}
        onEditStop={() => setMapEventsDisabled(false)}
        onDeleted={() => {
          setPolygons({
            type: 'MultiPolygon',
            coordinates: [],
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
