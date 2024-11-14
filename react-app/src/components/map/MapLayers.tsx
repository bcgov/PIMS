import React from 'react';
import { LayersControl, TileLayer, WMSTileLayer } from 'react-leaflet';

// Define URLs and layers
const LAYER_CONFIGS = {
  administrativeBoundaries: [
    {
      name: 'Current Census Economic Regions',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW/ows?',
      layers: 'pub:WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW',
    },
    {
      name: 'MOTI Regional Boundaries',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.TADM_MOT_REGIONAL_BNDRY_POLY/ows?',
      layers: 'pub:WHSE_ADMIN_BOUNDARIES.TADM_MOT_REGIONAL_BNDRY_POLY',
    },
    {
      name: 'Municipality Boundaries',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP',
    },
    {
      name: 'Regional District Boundaries',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_REGIONAL_DISTRICTS_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_REGIONAL_DISTRICTS_SP',
    },
  ],
  firstNations: [
    {
      name: 'First Nations Reserves',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP/ows?',
      layers: 'pub:WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP',
    },
    {
      name: 'First Nation Treaty Areas',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_AREA_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_AREA_SP',
    },
    {
      name: 'First Nations Treaty Lands',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_LAND_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_LAND_SP',
    },
    {
      name: 'First Nations Treaty Related Lands',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_RELATED_LAND_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_RELATED_LAND_S',
    },
    {
      name: 'First Nation Treaty Side Agreements',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_SIDE_AGREEMENTS_SP/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_SIDE_AGREEMENTS_SP',
    },
  ],
  landOwnership: [
    {
      name: 'Crown Leases',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_LEASES_SVW/ows?',
      layers: 'pub:WHSE_TANTALIS.TA_CROWN_LEASES_SVW',
    },
    {
      name: 'Crown Inventory',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW/ows?',
      layers: 'pub:WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW',
    },
    {
      name: 'Crown Land Licenses',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_LICENSES_SVW/ows?',
      layers: 'pub:WHSE_TANTALIS.TA_CROWN_LICENSES_SVW',
    },
    {
      name: 'Parcel Boundaries',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows',
      layers: 'pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW',
    },
  ],
  zoning: [
    {
      name: 'Zoning',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_BOUNDARY_LINES_SVW/ows?',
      layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_BOUNDARY_LINES_SVW',
    },
  ],
  disturbances: [
    {
      name: 'Disturbances',
      url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_WASTE.SITE_ENV_RMDTN_SITES_SVW/ows?',
      layers: 'pub:WHSE_WASTE.SITE_ENV_RMDTN_SITES_SVW',
    },
  ],
};

interface MapLayersProps {
  hideControls: boolean;
}

const MapLayers = (props: MapLayersProps) => {
  const { hideControls } = props;
  // If layer control is hidden, must still return a default tileset to use
  // Also showing parcel boundaries
  if (hideControls) {
    const parcelBoundaryLayer = LAYER_CONFIGS.landOwnership.find(
      (layer) => layer.name === 'Parcel Boundaries',
    );
    return (
      <>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
        />
        <WMSTileLayer
          url={parcelBoundaryLayer.url}
          format="image/png"
          transparent={true}
          layers={parcelBoundaryLayer.layers}
          opacity={0.5}
        />
      </>
    );
  }
  return (
    <LayersControl position="topleft">
      <LayersControl.BaseLayer checked name="Street Map">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Satellite">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
        />
      </LayersControl.BaseLayer>

      {LAYER_CONFIGS.administrativeBoundaries.map(({ name, url, layers }) => (
        <LayersControl.Overlay key={name} name={name}>
          <WMSTileLayer
            url={url}
            format="image/png"
            transparent={true}
            layers={layers}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      ))}

      {LAYER_CONFIGS.firstNations.map(({ name, url, layers }) => (
        <LayersControl.Overlay key={name} name={name}>
          <WMSTileLayer
            url={url}
            format="image/png"
            transparent={true}
            layers={layers}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      ))}

      {LAYER_CONFIGS.landOwnership.map(({ name, url, layers }) => (
        <LayersControl.Overlay key={name} name={name} checked={name === 'Parcel Boundaries'}>
          <WMSTileLayer
            url={url}
            format="image/png"
            transparent={true}
            layers={layers}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      ))}

      {LAYER_CONFIGS.zoning.map(({ name, url, layers }) => (
        <LayersControl.Overlay key={name} name={name}>
          <WMSTileLayer
            url={url}
            format="image/png"
            transparent={true}
            layers={layers}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      ))}

      {LAYER_CONFIGS.disturbances.map(({ name, url, layers }) => (
        <LayersControl.Overlay key={name} name={name}>
          <WMSTileLayer
            url={url}
            format="image/png"
            transparent={true}
            layers={layers}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  );
};

export default MapLayers;
