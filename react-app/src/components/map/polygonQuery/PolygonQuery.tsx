import { LatLngExpression } from "leaflet";
import React from "react";
import { Polygon, Popup } from "react-leaflet";


const PolygonQuery = () => {
  const polygon2 = [[49.129, -117.203],[50.129, -116.203],[51.129, -118.203]];

  return <Polygon positions={polygon2 as LatLngExpression[]}><Popup>Hi</Popup></Polygon>
}

export default PolygonQuery;
