import React, { useEffect } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'esri-leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import * as EL from 'esri-leaflet';

const EsriFeatureLayer = () => {
  const map = useMap();

  useEffect(() => {
    new EL.FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0',
    }).addTo(map);
  }, [map]);

  return <></>;
};

const EsriGeocoder = () => {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    new ELG.Geosearch({
      position: 'topright',
      placeholder: 'Enter an address',
      useMapBounds: false,

      providers: [
        // @ts-ignore
        ELG.arcgisOnlineProvider({
          apikey:
            'AAPK93366c08f59444f381edba619017813b9SnbJPvthOR1DO-sYctZoiWzp87GMp5PQLkGRI_yFoUZdV5CfmcrnmoYnzoWfmyj',
        }),
      ],
    }).addTo(map);
  }, [map]);

  return <></>;
};

const BaseMap = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%' }}
    >
      <EsriFeatureLayer />
      <EsriGeocoder />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default BaseMap;
