import './Map.scss';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LatLngBounds, LeafletMouseEvent, LeafletEvent, LatLng, Map as LeafletMap } from 'leaflet';
import {
  MapProps as LeafletMapProps,
  TileLayer,
  Popup,
  LayersControl,
  WMSTileLayer,
  Map as ReactLeafletMap,
} from 'react-leaflet';
import { IProperty, IPropertyDetail, storeParcelDetail } from 'actions/parcelsActions';
import { Container, Row, Col } from 'react-bootstrap';
import MapFilterBar, { MapFilterChangeEvent } from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { decimalOrNull, floatOrNull } from 'utils';
import { PopupView } from '../PopupView';
import { useDispatch, useSelector } from 'react-redux';
import { setMapViewZoom } from 'reducers/mapViewZoomSlice';
import { RootState } from 'reducers/rootReducer';
import { BBox } from 'geojson';
import { createPoints, PointFeature, asProperty } from './mapUtils';
import PointClusterer from './PointClusterer';
import { LegendControl } from './Legend/LegendControl';
import { useMediaQuery } from 'react-responsive';
import { useApi } from 'hooks/useApi';
import { useRouterFilter } from 'hooks/useRouterFilter';
import ReactResizeDetector from 'react-resize-detector';
import {
  municipalityLayerPopupConfig,
  MUNICIPALITY_LAYER_URL,
  parcelLayerPopupConfig,
  PARCELS_LAYER_URL,
} from './LayerPopup/constants';
import { isEmpty } from 'lodash';
import {
  LayerPopupContent,
  LayerPopupTitle,
  PopupContentConfig,
} from './LayerPopup/LayerPopupContent';
import { useLayerQuery } from './LayerPopup/hooks/useLayerQuery';

export type MapViewportChangeEvent = {
  bounds: LatLngBounds | null;
  filter?: {
    pid: string;
    address: string;
    administrativeArea: string;
    projectNumber: string;
    /** comma-separated list of agencies to filter by */
    agencies: string | null;
    classificationId: number | null;
    minLotSize: number | null;
    maxLotSize: number | null;
    inSurplusPropertyProgram?: boolean;
    inEnhancedReferralProcess?: boolean;
  };
};

export type MapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  properties: IProperty[];
  agencies: ILookupCode[];
  propertyClassifications: ILookupCode[];
  lotSizes: number[];
  mapRef: React.RefObject<ReactLeafletMap<LeafletMapProps, LeafletMap>>;
  selectedProperty?: IPropertyDetail | null;
  onMarkerClick?: (obj: IProperty, position?: [number, number]) => void;
  onMarkerPopupClose?: (obj: IPropertyDetail) => void;
  onViewportChanged?: (e: MapViewportChangeEvent) => void;
  onMapClick?: (e: LeafletMouseEvent) => void;
  disableMapFilterBar?: boolean;
  interactive?: boolean;
  showParcelBoundaries?: boolean;
};

export type LayerPopupInformation = PopupContentConfig & {
  latlng: LatLng;
  title: string;
};

const Map: React.FC<MapProps> = ({
  lat,
  lng,
  zoom: zoomProp,
  properties,
  agencies,
  propertyClassifications,
  lotSizes,
  selectedProperty,
  onMarkerClick,
  onMarkerPopupClose,
  onViewportChanged,
  onMapClick,
  disableMapFilterBar,
  interactive = true,
  mapRef,
}) => {
  // state and refs
  const dispatch = useDispatch();
  const [mapFilter, setMapFilter] = useState<MapFilterChangeEvent>({
    pid: '',
    searchBy: 'address',
    address: '',
    administrativeArea: '',
    projectNumber: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
  });
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);
  const smallScreen = useMediaQuery({ maxWidth: 1800 });
  const { getAdministrativeAreaLatLng } = useApi();
  const [mapWidth, setMapWidth] = useState(0);
  useRouterFilter(mapFilter, setMapFilter, 'mapFilter');
  const municipalitiesService = useLayerQuery(MUNICIPALITY_LAYER_URL);
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);

  const [layerPopup, setLayerPopup] = useState<LayerPopupInformation>();
  if (mapRef.current && !selectedProperty?.parcelDetail) {
    lat = (mapRef.current.props.center as Array<number>)[0];
    lng = (mapRef.current.props.center as Array<number>)[1];
  }

  const lastZoom = useSelector<RootState, number>(state => state.mapViewZoom) ?? zoomProp;
  useEffect(() => {
    dispatch(setMapViewZoom(smallScreen ? 4.9 : 5.5));
  }, [dispatch, smallScreen]);

  useEffect(() => {
    mapRef.current?.leafletElement.invalidateSize();
  }, [mapRef, mapWidth]);

  // TODO: refactor various zoom settings
  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState(lastZoom);

  if (!interactive) {
    const map = mapRef.current?.leafletElement;
    if (map) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) {
        map.tap.disable();
      }
    }
  }
  // --- Internal functions and event handlers
  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current?.leafletElement.getBounds();
  };

  const handleViewportChange = (filter: MapFilterChangeEvent) => {
    const bounds = getBounds();
    const {
      pid,
      address,
      administrativeArea,
      projectNumber,
      agencies,
      classificationId,
      minLotSize,
      maxLotSize,
      inSurplusPropertyProgram,
      inEnhancedReferralProcess,
    } = filter;
    const e: MapViewportChangeEvent = {
      bounds,
      filter: {
        pid,
        address,
        administrativeArea,
        projectNumber,
        agencies: agencies,
        classificationId: decimalOrNull(classificationId),
        minLotSize: floatOrNull(minLotSize),
        maxLotSize: floatOrNull(maxLotSize),
        inSurplusPropertyProgram,
        inEnhancedReferralProcess,
      },
    };
    onViewportChanged?.(e);
  };

  const onZoomEnd = (event: LeafletEvent) => {
    dispatch(setMapViewZoom(event.target._zoom));
  };

  const closeMarkerPopup = () => {
    setLayerPopup(undefined);
    dispatch(storeParcelDetail(null));
  };

  const zoomToAdministrativeArea = async (city: string) => {
    const center = await getAdministrativeAreaLatLng(city);
    if (center) {
      mapRef.current?.leafletElement.setZoomAround(center, 11);
    }
  };

  const handleMapFilterChange = async (e: MapFilterChangeEvent) => {
    if (e.administrativeArea) {
      await zoomToAdministrativeArea(e.administrativeArea);
    } else {
      fitMapBounds();
    }
    setMapFilter(e);
    handleViewportChange(e);
  };

  const handleBasemapToggle = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
  };

  const onSingleMarkerClick = (point: PointFeature, position?: [number, number]) => {
    onMarkerClick?.(asProperty(point), position);
  };

  useEffect(() => {
    // fetch GIS base layers configuration from /public folder
    axios.get('/basemaps.json').then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

  // load and prepare data
  const points = createPoints(properties);

  // get map bounds
  const updateMap = useCallback(() => {
    if (!mapRef?.current) {
      return;
    }
    const b = mapRef.current.leafletElement.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(mapRef.current.leafletElement.getZoom());
  }, [mapRef]);

  const renderPopup = (item: IPropertyDetail) => {
    const { propertyTypeId, parcelDetail, position } = item;
    if (!parcelDetail) {
      return null;
    }
    // allow the caller to override the popup location on the map
    // this is useful when showing "spiderfied" markers belonging to a cluster
    const latlng = position ?? [parcelDetail.latitude as number, parcelDetail.longitude as number];
    return (
      <Popup
        position={latlng}
        offset={[0, -25]}
        onClose={() => onMarkerPopupClose?.(item)}
        closeButton={interactive}
        autoPan={false} // fix for PIMS-2591: infinite loop crash
      >
        <PopupView
          propertyTypeId={propertyTypeId}
          propertyDetail={parcelDetail}
          disabled={!interactive}
        />
      </Popup>
    );
  };

  const fitMapBounds = () => {
    if (mapRef.current) {
      mapRef.current.leafletElement.fitBounds([
        [60.09114547, -119.49609429],
        [48.78370426, -139.35937554],
      ]);
    }
  };

  const showLocationDetails = async (event: LeafletMouseEvent) => {
    !!onMapClick && onMapClick(event);
    const municipality = await municipalitiesService.findOneWhereContains(event.latlng);
    const parcel = await parcelsService.findOneWhereContains(event.latlng);

    let properties = {};
    let displayConfig = {};
    let title = 'Municipality Information';
    if (municipality.features.length === 1) {
      properties = municipality.features[0].properties!;
      displayConfig = municipalityLayerPopupConfig;
    }

    if (parcel.features.length === 1) {
      title = 'Parcel Information';
      properties = parcel.features[0].properties!;
      displayConfig = parcelLayerPopupConfig;
    }

    if (!isEmpty(properties)) {
      setLayerPopup({
        title,
        data: properties as any,
        config: displayConfig as any,
        latlng: event.latlng,
      } as any);
    }
  };

  // return map
  return (
    <ReactResizeDetector handleWidth>
      {({ width }: any) => {
        setMapWidth(width);
        return (
          <Container fluid className="px-0 map">
            {!disableMapFilterBar ? (
              <Container fluid className="px-0 map-filter-container">
                <Container className="px-0">
                  <MapFilterBar
                    agencyLookupCodes={agencies}
                    propertyClassifications={propertyClassifications}
                    lotSizes={lotSizes}
                    mapFilter={mapFilter}
                    onFilterChange={handleMapFilterChange}
                    onFilterReset={fitMapBounds}
                  />
                </Container>
              </Container>
            ) : null}
            <Row noGutters>
              <Col>
                {baseLayers?.length > 0 && (
                  <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggle} />
                )}
                <ReactLeafletMap
                  ref={mapRef}
                  center={[lat, lng]}
                  zoom={lastZoom}
                  whenReady={() => {
                    fitMapBounds();
                    handleViewportChange(mapFilter);
                  }}
                  onViewportChanged={() => {
                    handleViewportChange(mapFilter);
                  }}
                  onclick={showLocationDetails}
                  closePopupOnClick={interactive}
                  onzoomend={onZoomEnd}
                  onzoomstart={closeMarkerPopup}
                  onmoveend={updateMap}
                >
                  {activeBasemap && (
                    <TileLayer
                      attribution={activeBasemap.attribution}
                      url={activeBasemap.url}
                      zIndex={0}
                    />
                  )}
                  <PointClusterer
                    points={points}
                    zoom={zoom}
                    bounds={bounds}
                    onMarkerClick={onSingleMarkerClick}
                  />
                  {selectedProperty && renderPopup(selectedProperty)}
                  {!!layerPopup && (
                    <Popup
                      position={layerPopup.latlng}
                      offset={[0, -25]}
                      onClose={() => setLayerPopup(undefined)}
                      closeButton={interactive}
                      autoPan={false}
                    >
                      <LayerPopupTitle>{layerPopup.title}</LayerPopupTitle>
                      <LayerPopupContent
                        data={layerPopup.data as any}
                        config={layerPopup.config as any}
                      />
                    </Popup>
                  )}
                  <LegendControl />

                  <LayersControl position="topright">
                    <LayersControl.Overlay checked name="Parcel Boundaries">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows?"
                        layers="pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
                        transparent={true}
                        format="image/png"
                        zIndex={10}
                        id="parcelLayer"
                      />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Municipalities">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/ows?"
                        layers="pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP"
                        transparent={true}
                        format="image/png"
                        opacity={0.5}
                        zIndex={8}
                        id="municipalityLayer"
                      />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Crown Leases">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_LEASES_SVW/ows?"
                        layers="pub:WHSE_TANTALIS.TA_CROWN_LEASES_SVW"
                        transparent={true}
                        format="image/png"
                        opacity={0.5}
                        zIndex={7}
                        id="crownLeases"
                      />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Crown Inventory">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW/ows?"
                        layers="pub:WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW"
                        transparent={true}
                        format="image/png"
                        opacity={0.5}
                        zIndex={6}
                        id="crownInventory"
                      />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Crown Inclusions">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_INCLUSIONS_SVW/ows?"
                        layers="pub:WHSE_TANTALIS.TA_CROWN_INCLUSIONS_SVW"
                        transparent={true}
                        format="image/png"
                        opacity={0.5}
                        zIndex={5}
                        id="crownInclusions"
                      />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Agricultural Land Reserve Lines">
                      <WMSTileLayer
                        url="https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_BOUNDARY_LINES_SVW/ows?"
                        layers="pub:WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_BOUNDARY_LINES_SVW"
                        transparent={true}
                        format="image/png"
                        opacity={0.5}
                        zIndex={4}
                        id="agriculturalLandReserveLines"
                      />
                    </LayersControl.Overlay>
                  </LayersControl>
                </ReactLeafletMap>
              </Col>
            </Row>
          </Container>
        );
      }}
    </ReactResizeDetector>
  );
};

export default Map;
