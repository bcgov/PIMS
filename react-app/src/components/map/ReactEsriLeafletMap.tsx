import React, { useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import EsriLeafletGeoSearch from 'react-esri-leaflet/plugins/EsriLeafletGeoSearch';
import VectorBasemapLayer from 'react-esri-leaflet/plugins/VectorBasemapLayer';
import { DynamicMapLayer, FeatureLayer } from 'react-esri-leaflet';

const municipality_url =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/ows?service=WMS&request=GetMap';
const parcel_url =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs';

const ReactEsriLeafletMap = () => {
  const geosearchControlRef = useRef();
  const handleClick = () => {
    if (geosearchControlRef) {
      //@ts-ignore
      geosearchControlRef.current.disable();
    }
  };
  const layerRef = useRef();
  layerRef?.current?.on('tileload', (e) => {
    console.log('The underlying leaflet tileload event is:', e);
  });
  const ARCGIS_API_KEY =
    'put the api key here';
  return (
    <MapContainer
      center={[51.505, -125]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
    >
      <button onClick={handleClick}>Disable Geosearch</button>
      <VectorBasemapLayer ref={layerRef} name="ArcGIS:Streets" token={ARCGIS_API_KEY} />
      <FeatureLayer
        url={'https://maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_cadastre/MapServer/0'}
      />
      <DynamicMapLayer url={municipality_url} format="image/png" />
      <EsriLeafletGeoSearch
        ref={geosearchControlRef}
        position="topleft"
        useMapBounds={false}
        placeholder="Search for places or addresses"
        providers={{
          arcgisOnlineProvider: {
            apikey: ARCGIS_API_KEY,
          },
          featureLayerProvider: {
            url: 'https://services.arcgis.com/BG6nSlhZSAWtExvp/ArcGIS/rest/services/GIS_Day_Registration_Form_2019_Hosted_View_Layer/FeatureServer/0',
            searchFields: ['event_name', 'host_organization'],
            label: 'GIS Day Events 2019',
            bufferRadius: 5000,
            formatSuggestion: function (feature) {
              return feature.properties.event_name + ' - ' + feature.properties.host_organization;
            },
          },
        }}
        eventHandlers={{
          requeststart: () => console.log('Started request...'),
          requestend: () => console.log('Ended request...'),
          results: (r) => console.log(r),
        }}
        key={ARCGIS_API_KEY}
      />
    </MapContainer>
  );
};

export default ReactEsriLeafletMap;
