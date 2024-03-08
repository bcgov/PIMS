import React, { useRef } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import EsriLeafletGeoSearch from 'react-esri-leaflet/plugins/EsriLeafletGeoSearch';
import { FeatureLayer } from 'react-esri-leaflet';
//import { useKeycloak } from '@bcgov/citz-imb-kc-react';

const municipality_url =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/ows';
const cultural_url = 'https://test.apps.gov.bc.ca/ext/sgw/geo.bca/ows';

const ReactEsriLeafletMap = () => {
  //const keycloak = useKeycloak();
  const geosearchControlRef = useRef();
  const handleClick = () => {
    if (geosearchControlRef) {
      //@ts-ignore
      geosearchControlRef.current.disable();
    }
  };
  //const layerRef = useRef();
  const ARCGIS_API_KEY = process.env.ARCGIS_API_KEY;
  return (
    <MapContainer
      scrollWheelZoom={true}
      style={{ height: '100%' }}
      bounds={[
        [51.2516, -129.371],
        [48.129, -122.203],
      ]}
    >
      <button onClick={handleClick}>Disable Geosearch</button>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureLayer
        url={'https://maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_cadastre/MapServer/0'}
      />
      {/* <DynamicMapLayer url={municipality_url} f="image" format="image/png"/> */}
      <WMSTileLayer
        url={municipality_url}
        format="image/png"
        transparent={true}
        opacity={0.5}
        params={{ layers: 'WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP' }}
      />
      <WMSTileLayer
        url={cultural_url}
        format="image/png"
        transparent={true}
        opacity={0.5}
        params={{ layers: 'WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV' }}
      />
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
