import L, { IconOptions } from 'leaflet';
import buildingErpPng from '@/assets/markers/building-erp.png';
import buildingErpHighlightPng from '@/assets/markers/building-erp-highlight.png';
import buildingIconPng from '@/assets/markers/building-reg.png';
import buildingSelectedIconPng from '@/assets/markers/building-reg-highlight.png';
import buildingSplPng from '@/assets/markers/building-spl.png';
import buildingSplHighlightPng from '@/assets/markers/building-spl-highlight.png';
import landErpPng from '@/assets/markers/land-erp.png';
import landErpHighlightPng from '@/assets/markers/land-erp-highlight.png';
import parcelIconPng from '@/assets/markers/land-reg.png';
import parcelSelectedIconPng from '@/assets/markers/land-reg-highlight.png';
import landSplPng from '@/assets/markers/land-spl.png';
import landSplHighlightPng from '@/assets/markers/land-spl-highlight.png';
import markerBluePng from '@/assets/markers/marker-blue.png';
import markerGreenPng from '@/assets/markers/marker-green.png';
import subdivErpPng from '@/assets/markers/subdiv-erp.png';
import subdivErpHighlightPng from '@/assets/markers/subdiv-erp-highlight.png';
import subdivRegPng from '@/assets/markers/subdiv-reg.png';
import subdivRegHighlightPng from '@/assets/markers/subdiv-reg-highlight.png';
import subdivSplPng from '@/assets/markers/subdiv-spl.png';
import subdivSplHighlightPng from '@/assets/markers/subdiv-spl-highlight.png';
import { PropertyTypes } from '@/constants/propertyTypes';

// TODO: Expand to handle more Property Pin types
export const getMatchingPropertyPin = (propertyType: PropertyTypes, isSelected?: boolean) => {
  switch (true) {
    case propertyType === PropertyTypes.LAND:
      return isSelected ? parcelIconSelect : parcelIcon;
    case propertyType === PropertyTypes.BUILDING:
      return isSelected ? buildingIconSelect : buildingIcon;
    case propertyType === PropertyTypes.SUBDIVISION:
      return isSelected ? subdivisionIconSelect : subdivisionIcon;
    default:
      return geocoderIcon;
  }
};

// default icon values
const defaults: Partial<IconOptions> = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};

// parcel icon (green)
export const parcelIcon = L.icon({
  ...defaults,
  iconUrl: parcelIconPng,
});

// parcel icon (green) highlighted
export const parcelIconSelect = L.icon({
  ...defaults,
  iconUrl: parcelSelectedIconPng,
});

// building icon (blue)
export const buildingIcon = L.icon({
  ...defaults,
  iconUrl: buildingIconPng,
});

// building icon (blue) highlighted
export const buildingIconSelect = L.icon({
  ...defaults,
  iconUrl: buildingSelectedIconPng,
});

// subdivision icon (green)
export const subdivisionIcon = L.icon({
  ...defaults,
  iconUrl: subdivRegPng,
});

// subdivision icon (green) highlighted
export const subdivisionIconSelect = L.icon({
  ...defaults,
  iconUrl: subdivRegHighlightPng,
});

export const geocoderIcon = L.icon({
  ...defaults,
  iconUrl: markerGreenPng,
});

// draft parcel icon (green)
export const draftParcelIcon = L.icon({
  ...defaults,
  iconUrl: markerGreenPng,
  className: 'draft',
});

// draft building icon (blue)
export const draftBuildingIcon = L.icon({
  ...defaults,
  iconUrl: markerBluePng,
  className: 'draft',
});

// spp icon (purple)
export const landSppIcon = L.icon({
  ...defaults,
  iconUrl: landSplPng,
});

// spp icon (purple) highlighted
export const landSppIconSelect = L.icon({
  ...defaults,
  iconUrl: landSplHighlightPng,
});

// erp icon (red)
export const landErpIcon = L.icon({
  ...defaults,
  iconUrl: landErpPng,
});

// erp icon (red) highlight
export const landErpIconSelect = L.icon({
  ...defaults,
  iconUrl: landErpHighlightPng,
});

// spp icon (purple)
export const buildingSppIcon = L.icon({
  ...defaults,
  iconUrl: buildingSplPng,
});

// spp icon (purple) highlight
export const buildingSppIconSelect = L.icon({
  ...defaults,
  iconUrl: buildingSplHighlightPng,
});

// erp icon (red)
export const buildingErpIcon = L.icon({
  ...defaults,
  iconUrl: buildingErpPng,
});

// erp icon (red) highlighted
export const buildingErpIconSelect = L.icon({
  ...defaults,
  iconUrl: buildingErpHighlightPng,
});

// spp icon (purple)
export const subdivisionSppIcon = L.icon({
  ...defaults,
  iconUrl: subdivSplPng,
});

// spp icon (purple) highlighted
export const subdivisionSppIconSelect = L.icon({
  ...defaults,
  iconUrl: subdivSplHighlightPng,
});

// erp icon (red)
export const subdivisionErpIcon = L.icon({
  ...defaults,
  iconUrl: subdivErpPng,
});

// erp icon (red) highlight
export const subdivisionErpIconSelect = L.icon({
  ...defaults,
  iconUrl: subdivErpHighlightPng,
});
