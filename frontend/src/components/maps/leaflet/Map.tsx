import './Map.scss';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LatLngBounds,
  LeafletMouseEvent,
  LeafletEvent,
  LatLng,
  Map as LeafletMap,
  geoJSON,
} from 'leaflet';
import {
  MapProps as LeafletMapProps,
  TileLayer,
  Popup,
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
import { Feature } from 'geojson';
import { createPoints, asProperty } from './mapUtils';
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
import { saveParcelLayerData } from 'reducers/parcelLayerDataSlice';
import useActiveFeatureLayer from '../hooks/useActiveFeatureLayer';
import useMarkerZoom from '../hooks/useMarkerZoom';
import LayersControl from './LayersControl';
import { InventoryLayer } from './InventoryLayer';
import { PointFeature } from '../types';

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
  center?: LatLng;
  feature: Feature;
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

  // load and prepare data
  const points = createPoints(properties);
  const { setZoomProperty, onMarkerZoomEnd } = useMarkerZoom({
    mapRef,
    points,
  });

  const [layerPopup, setLayerPopup] = useState<LayerPopupInformation>();
  if (mapRef.current && !selectedProperty?.parcelDetail) {
    lat = (mapRef.current.props.center as Array<number>)[0];
    lng = (mapRef.current.props.center as Array<number>)[1];
  }
  useActiveFeatureLayer({ selectedProperty, layerPopup, mapRef });

  const lastZoom = useSelector<RootState, number>(state => state.mapViewZoom) ?? zoomProp;
  useEffect(() => {
    dispatch(setMapViewZoom(smallScreen ? 4.9 : 5.5));
  }, [dispatch, smallScreen]);

  useEffect(() => {
    mapRef.current?.leafletElement.invalidateSize();
  }, [mapRef, mapWidth]);

  // TODO: refactor various zoom settings
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
    onMarkerZoomEnd();
    dispatch(setMapViewZoom(event.target._zoom));
  };

  const closeMarkerPopup = (e: any) => {
    if (e.target._animateToZoom === mapRef.current?.leafletElement.getZoom()) {
      setLayerPopup(undefined);
      dispatch(storeParcelDetail(null));
    }
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

  // get map bounds
  const updateMap = useCallback(() => {
    if (!mapRef?.current) {
      return;
    }
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
          zoomTo={zoom < 14 ? () => setZoomProperty(selectedProperty) : undefined}
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
    let center: LatLng | undefined;
    let displayConfig = {};
    let title = 'Municipality Information';
    let feature = {};
    if (municipality.features.length === 1) {
      properties = municipality.features[0].properties!;
      displayConfig = municipalityLayerPopupConfig;
      feature = municipality.features[0];
    }

    if (parcel.features.length === 1) {
      title = 'Parcel Information';
      properties = parcel.features[0].properties!;
      displayConfig = parcelLayerPopupConfig;
      center = parcel.features[0]?.geometry
        ? geoJSON(parcel.features[0].geometry)
            .getBounds()
            .getCenter()
        : undefined;
      feature = parcel.features[0];
    }

    if (!isEmpty(properties)) {
      setLayerPopup({
        title,
        data: properties as any,
        config: displayConfig as any,
        latlng: event.latlng,
        center,
        feature,
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
                        center={layerPopup.center}
                        onAddToParcel={(e: MouseEvent, data: { [key: string]: string }) => {
                          dispatch(saveParcelLayerData({ e, data }));
                        }}
                      />
                    </Popup>
                  )}
                  <LegendControl />
                  <LayersControl />
                  <InventoryLayer
                    zoom={zoom}
                    onMarkerClick={onSingleMarkerClick}
                    filter={{
                      ...mapFilter,
                      minLandArea: mapFilter.minLotSize,
                      maxLandArea: mapFilter.maxLotSize,
                    }}
                  ></InventoryLayer>
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
