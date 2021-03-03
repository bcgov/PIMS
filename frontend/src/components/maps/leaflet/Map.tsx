import './Map.scss';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngBounds, LeafletMouseEvent, LatLng, Map as LeafletMap, geoJSON } from 'leaflet';
import {
  MapProps as LeafletMapProps,
  TileLayer,
  Popup,
  Map as ReactLeafletMap,
} from 'react-leaflet';
import { IProperty, IPropertyDetail, storeParcelDetail } from 'actions/parcelsActions';
import { Container, Row, Col } from 'react-bootstrap';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { useDispatch, useSelector } from 'react-redux';
import { setMapViewZoom, DEFAULT_MAP_ZOOM } from 'reducers/mapViewZoomSlice';
import { RootState } from 'reducers/rootReducer';
import { Feature, GeoJsonObject } from 'geojson';
import { LegendControl } from './Legend/LegendControl';
import { useMediaQuery } from 'react-responsive';
import ReactResizeDetector from 'react-resize-detector';
import {
  municipalityLayerPopupConfig,
  MUNICIPALITY_LAYER_URL,
  parcelLayerPopupConfig,
  PARCELS_LAYER_URL,
} from './LayerPopup/constants';
import { isEmpty, isEqual, isEqualWith } from 'lodash';
import {
  LayerPopupContent,
  LayerPopupTitle,
  PopupContentConfig,
} from './LayerPopup/LayerPopupContent';
import classNames from 'classnames';
import { useLayerQuery } from './LayerPopup/hooks/useLayerQuery';
import { saveParcelLayerData } from 'reducers/parcelLayerDataSlice';
import { SidebarSize } from 'features/mapSideBar/hooks/useQueryParamSideBar';
import useActiveFeatureLayer from '../hooks/useActiveFeatureLayer';
import LayersControl from './LayersControl';
import { InventoryLayer } from './InventoryLayer';
import { IGeoSearchParams } from 'constants/API';
import { decimalOrUndefined, floatOrUndefined } from 'utils';
import { IPropertyFilter } from 'features/properties/filter/IPropertyFilter';
import { PropertyFilter } from 'features/properties/filter';
import { useFilterContext } from '../providers/FIlterProvider';
import { ZoomOutButton } from './ZoomOut/ZoomOutButton';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from '../../../constants';
import InfoSlideOut from './InfoSlideOut/InfoSlideOut';
import { PropertyPopUpContextProvider } from '../providers/PropertyPopUpProvider';
import FilterBackdrop from './FilterBackdrop';

export type MapViewportChangeEvent = {
  bounds: LatLngBounds | null;
  filter?: IGeoSearchParams;
};

export type MapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  properties: IProperty[];
  agencies: ILookupCode[];
  administrativeAreas: ILookupCode[];
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
  sidebarSize?: SidebarSize;
};

export type LayerPopupInformation = PopupContentConfig & {
  latlng: LatLng;
  title: string;
  center?: LatLng;
  bounds?: LatLngBounds;
  feature: Feature;
};

const defaultFilterValues: IPropertyFilter = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  propertyType: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  rentableArea: '',
  name: '',
  maxAssessedValue: '',
  maxMarketValue: '',
  maxNetBookValue: '',
  includeAllProperties: false,
  surplusFilter: false,
};

const whitelistedFilterKeys = [
  'pid',
  'address',
  'administrativeArea',
  'projectNumber',
  'classificationId',
  'agencies',
  'minLandArea',
  'maxLandArea',
  'rentableArea',
  'inSurplusPropertyProgram',
  'inEnhancedReferralProcess',
  'name',
  'predominateUseId',
  'constructionTypeId',
  'floorCount',
  'bareLandOnly',
  'includeAllProperties',
];

/**
 * Converts the map filter to a geo search filter.
 * @param filter The map filter.
 */
const getQueryParams = (filter: IPropertyFilter): IGeoSearchParams => {
  return {
    pid: filter.pid,
    address: filter.address,
    administrativeArea: filter.administrativeArea,
    projectNumber: filter.projectNumber,
    classificationId: decimalOrUndefined(filter.classificationId),
    agencies: filter.agencies,
    minLandArea: floatOrUndefined(filter.minLotSize),
    maxLandArea: floatOrUndefined(filter.maxLotSize),
    rentableArea: floatOrUndefined(filter.rentableArea),
    inSurplusPropertyProgram: filter.inSurplusPropertyProgram,
    inEnhancedReferralProcess: filter.inEnhancedReferralProcess,
    name: filter.name,
    predominateUseId: parseInt(filter.predominateUseId!),
    constructionTypeId: parseInt(filter.constructionTypeId!),
    floorCount: parseInt(filter.floorCount!),
    bareLandOnly: filter.bareLandOnly,
    includeAllProperties: filter.includeAllProperties,
  };
};

const defaultBounds = new LatLngBounds([60.09114547, -119.49609429], [48.78370426, -139.35937554]);

/**
 * Creates a Leaflet map and by default includes a number of preconfigured layers.
 * @param param0
 */
const Map: React.FC<MapProps> = ({
  lat,
  lng,
  zoom: zoomProp,
  agencies,
  administrativeAreas,
  lotSizes,
  selectedProperty,
  onMarkerClick,
  onMapClick,
  disableMapFilterBar,
  interactive = true,
  mapRef,
  sidebarSize,
}) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const [geoFilter, setGeoFilter] = useState<IGeoSearchParams>({
    ...defaultFilterValues,
    includeAllProperties: keycloak.hasClaim(Claims.ADMIN_PROPERTIES),
  } as any);
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);
  const smallScreen = useMediaQuery({ maxWidth: 1800 });
  const [mapWidth, setMapWidth] = useState(0);
  const municipalitiesService = useLayerQuery(MUNICIPALITY_LAYER_URL);
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);
  const [bounds, setBounds] = useState<LatLngBounds>(defaultBounds);
  const { setChanged } = useFilterContext();
  const [layerPopup, setLayerPopup] = useState<LayerPopupInformation>();
  if (mapRef.current && !selectedProperty?.parcelDetail) {
    lat = (mapRef.current.props.center as Array<number>)[0];
    lng = (mapRef.current.props.center as Array<number>)[1];
  }
  const parcelLayerFeature = useSelector<RootState, GeoJsonObject | null>(
    state => state.parcelLayerData?.parcelLayerFeature,
  );
  useActiveFeatureLayer({
    selectedProperty,
    layerPopup,
    mapRef,
    parcelLayerFeature,
    setLayerPopup,
  });
  const [showFilterBackdrop, setShowFilterBackdrop] = useState(true);

  const lastZoom = useSelector<RootState, number>(state => state.mapViewZoom) ?? zoomProp;
  const [zoom, setZoom] = useState(lastZoom);
  useEffect(() => {
    if (lastZoom === DEFAULT_MAP_ZOOM) {
      dispatch(setMapViewZoom(smallScreen ? 4.9 : 5.5));
    } else if (lastZoom !== zoom && zoom !== DEFAULT_MAP_ZOOM) {
      dispatch(setMapViewZoom(zoom));
    }
  }, [dispatch, lastZoom, smallScreen, zoom]);

  useEffect(() => {
    mapRef.current?.leafletElement.invalidateSize();
  }, [mapRef, mapWidth]);

  // TODO: refactor various zoom settings

  useEffect(() => {
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
  }, [interactive, mapRef]);

  const handleMapFilterChange = async (filter: IPropertyFilter) => {
    const compareValues = (objValue: any, othValue: any) => {
      return whitelistedFilterKeys.reduce((acc, key) => {
        return (isEqual(objValue[key], othValue[key]) || (!objValue[key] && !othValue[key])) && acc;
      }, true);
    };
    if (!isEqualWith(geoFilter, filter, compareValues)) {
      dispatch(storeParcelDetail(null));
      setGeoFilter(getQueryParams(filter));
      setChanged(true);
    }
  };

  const handleBasemapToggle = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
  };

  useEffect(() => {
    // fetch GIS base layers configuration from /public folder
    axios.get('/basemaps.json')?.then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

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
    let bounds: LatLngBounds | undefined;
    let displayConfig = {};
    let title = 'Municipality Information';
    let feature = {};
    if (municipality.features.length === 1) {
      properties = municipality.features[0].properties!;
      displayConfig = municipalityLayerPopupConfig;
      feature = municipality.features[0];
      bounds = municipality.features[0]?.geometry
        ? geoJSON(municipality.features[0].geometry).getBounds()
        : undefined;
    }

    if (parcel.features.length === 1) {
      title = 'Parcel Information';
      properties = parcel.features[0].properties!;
      displayConfig = parcelLayerPopupConfig;
      bounds = parcel.features[0]?.geometry
        ? geoJSON(parcel.features[0].geometry).getBounds()
        : undefined;
      center = bounds?.getCenter();
      feature = parcel.features[0];
    }

    if (!isEmpty(properties)) {
      setLayerPopup({
        title,
        data: properties as any,
        config: displayConfig as any,
        latlng: event.latlng,
        center,
        bounds,
        feature,
      } as any);
    }
  };

  const handleBounds = (e: any) => {
    const boundsData: LatLngBounds = e.target.getBounds();
    if (!isEqual(boundsData.getNorthEast(), boundsData.getSouthWest())) {
      setBounds(boundsData);
    }
  };

  const [infoOpen, setInfoOpen] = React.useState(false);
  const [layersOpen, setLayersOpen] = React.useState(false);
  return (
    <ReactResizeDetector handleWidth>
      {({ width }: any) => {
        setMapWidth(width);
        return (
          <Container fluid className={classNames('px-0 map', { narrow: sidebarSize === 'narrow' })}>
            <FilterBackdrop show={showFilterBackdrop} />
            {!disableMapFilterBar ? (
              <Container fluid className="px-0 map-filter-container">
                <Container className="px-0">
                  <PropertyFilter
                    defaultFilter={{
                      ...defaultFilterValues,
                      includeAllProperties: keycloak.hasClaim(Claims.ADMIN_PROPERTIES),
                    }}
                    agencyLookupCodes={agencies}
                    adminAreaLookupCodes={administrativeAreas}
                    onChange={handleMapFilterChange}
                    showAllAgencySelect={true}
                  />
                </Container>
              </Container>
            ) : null}
            <Row noGutters>
              <Col>
                {baseLayers?.length > 0 && (
                  <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggle} />
                )}
                <PropertyPopUpContextProvider>
                  <ReactLeafletMap
                    ref={mapRef}
                    center={[lat, lng]}
                    zoom={lastZoom}
                    whenReady={() => {
                      fitMapBounds();
                    }}
                    onclick={showLocationDetails}
                    closePopupOnClick={interactive}
                    onzoomend={e => setZoom(e.sourceTarget.getZoom())}
                    onmoveend={handleBounds}
                  >
                    {activeBasemap && (
                      <TileLayer
                        attribution={activeBasemap.attribution}
                        url={activeBasemap.url}
                        zIndex={0}
                      />
                    )}
                    {!!layerPopup && (
                      <Popup
                        position={layerPopup.latlng}
                        offset={[0, -25]}
                        onClose={() => {
                          setLayerPopup(undefined);
                          dispatch(storeParcelDetail(null));
                        }}
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
                          bounds={layerPopup.bounds}
                        />
                      </Popup>
                    )}
                    <LegendControl />
                    <ZoomOutButton map={mapRef} bounds={defaultBounds} />
                    <LayersControl
                      open={layersOpen}
                      setOpen={() => {
                        setLayersOpen(!layersOpen);
                        setInfoOpen(false);
                      }}
                    />
                    <InfoSlideOut
                      open={infoOpen}
                      setOpen={(state: boolean) => {
                        setInfoOpen(state);
                        setLayersOpen(false);
                      }}
                      onHeaderActionClick={() => {
                        setInfoOpen(false);
                      }}
                    />
                    <InventoryLayer
                      zoom={zoom}
                      bounds={bounds}
                      onMarkerClick={() => {
                        if (!infoOpen) {
                          setLayersOpen(false);
                          setInfoOpen(true);
                        }
                      }}
                      selected={selectedProperty}
                      filter={geoFilter}
                      onRequestData={setShowFilterBackdrop}
                    ></InventoryLayer>
                  </ReactLeafletMap>
                </PropertyPopUpContextProvider>
              </Col>
            </Row>
          </Container>
        );
      }}
    </ReactResizeDetector>
  );
};

export default Map;
