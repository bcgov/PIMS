import L from "leaflet";
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

// parcel icon (green)
export const parcelIcon = L.icon({
  iconUrl: parcelIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// parcel icon (green) highlighted
export const parcelIconSelect = L.icon({
  iconUrl: parcelSelectedIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// building icon (blue)
export const buildingIcon = L.icon({
  iconUrl: buildingIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// building icon (blue) highlighted
export const buildingIconSelect = L.icon({
  iconUrl: buildingSelectedIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// subdivision icon (green)
export const subdivisionIcon = L.icon({
  iconUrl: subdivRegPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// subdivision icon (green) highlighted
export const subdivisionIconSelect = L.icon({
  iconUrl: subdivRegHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const geocoderIcon = L.icon({
  iconUrl: markerGreenPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// draft parcel icon (green)
export const draftParcelIcon = L.icon({
  iconUrl: markerGreenPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'draft',
});

// draft building icon (blue)
export const draftBuildingIcon = L.icon({
  iconUrl: markerBluePng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'draft',
});

// spp icon (purple)
export const landSppIcon = L.icon({
  iconUrl: landSplPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// spp icon (purple) highlighted
export const landSppIconSelect = L.icon({
  iconUrl: landSplHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red)
export const landErpIcon = L.icon({
  iconUrl: landErpPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red) highlight
export const landErpIconSelect = L.icon({
  iconUrl: landErpHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// spp icon (purple)
export const buildingSppIcon = L.icon({
  iconUrl: buildingSplPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// spp icon (purple) highlight
export const buildingSppIconSelect = L.icon({
  iconUrl: buildingSplHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red)
export const buildingErpIcon = L.icon({
  iconUrl: buildingErpPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red) highlighted
export const buildingErpIconSelect = L.icon({
  iconUrl: buildingErpHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// spp icon (purple)
export const subdivisionSppIcon = L.icon({
  iconUrl: subdivSplPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// spp icon (purple) highlighted
export const subdivisionSppIconSelect = L.icon({
  iconUrl: subdivSplHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red)
export const subdivisionErpIcon = L.icon({
  iconUrl: subdivErpPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red) highlight
export const subdivisionErpIconSelect = L.icon({
  iconUrl: subdivErpHighlightPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
