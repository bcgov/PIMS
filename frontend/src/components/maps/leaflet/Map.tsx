import './Map.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { IProperty, IPropertyDetail } from 'actions/parcelsActions';
import axios from 'axios';
import classNames from 'classnames';
import GenericModal from 'components/common/GenericModal';
import { IGeoSearchParams } from 'constants/API';
import { MAX_ZOOM } from 'constants/strings';
import { SidebarSize } from 'features/mapSideBar/hooks/useQueryParamSideBar';
import { PropertyFilter } from 'features/properties/filter';
import { IPropertyFilter } from 'features/properties/filter/IPropertyFilter';
import { Feature } from 'geojson';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import {
  geoJSON,
  LatLng,
  LatLngBounds,
  LeafletEvent,
  LeafletMouseEvent,
  Map as LeafletMap,
} from 'leaflet';
import { isEmpty, isEqual, isEqualWith } from 'lodash';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import {
  MapContainer as ReactLeafletMap,
  MapProps as LeafletMapProps,
  Popup,
  TileLayer,
} from 'react-leaflet';
import ReactResizeDetector from 'react-resize-detector';
import { useAppDispatch, useAppSelector } from 'store';
import { DEFAULT_MAP_ZOOM, setMapViewZoom } from 'store/slices/mapViewZoomSlice';
import { saveParcelLayerData } from 'store/slices/parcelLayerDataSlice';
import { storePropertyDetail } from 'store/slices/parcelSlice';
import { decimalOrUndefined, floatOrUndefined } from 'utils';

import { Claims } from '../../../constants';
import BasemapToggle, { BaseLayer, BasemapToggleEvent } from '../BasemapToggle';
import useActiveFeatureLayer from '../hooks/useActiveFeatureLayer';
import { useFilterContext } from '../providers/FIlterProvider';
import { PropertyPopUpContext } from '../providers/PropertyPopUpProvider';
import FilterBackdrop from './FilterBackdrop';
import InfoSlideOut from './InfoSlideOut/InfoSlideOut';
import { InventoryLayer } from './InventoryLayer';
import {
  MUNICIPALITY_LAYER_URL,
  municipalityLayerPopupConfig,
  parcelLayerPopupConfig,
  PARCELS_PUBLIC_LAYER_URL,
} from './LayerPopup/constants';
import { useLayerQuery } from './LayerPopup/hooks/useLayerQuery';
import {
  LayerPopupContent,
  LayerPopupTitle,
  PopupContentConfig,
} from './LayerPopup/LayerPopupContent';
import LayersControl from './LayersControl';
import { LegendControl } from './Legend/LegendControl';
import { ZoomOutButton } from './ZoomOut/ZoomOutButton';

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

const displayMessage = (
  <p>
    You might have clicked outside of a parcel boundary or you do not have access to the parcel
    layer yet. You can zoom into the map to ensure that you are actually clicking within the
    boundaries of a parcel. Please contact{' '}
    <a href="mailto:CITZ_RPD_IMIT_HELP@gov.bc.ca">CITZ_RPD_IMIT_HELP@gov.bc.ca</a> if you are still
    unable to access the parcel layer details.
  </p>
);

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
  inEnhancedReferralProcess: false,
  inSurplusPropertyProgram: false,
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
 * Creates a Leaflet map and by default includes a number of pre-configured layers.
 * @param param0
 */
const Map: React.FC<MapProps> = ({
  lat,
  lng,
  zoom: zoomProp = DEFAULT_MAP_ZOOM,
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
  const dispatch = useAppDispatch();
  const [triggerFilterChanged, setTriggerFilterChanged] = React.useState(true);
  const municipalitiesService = useLayerQuery(MUNICIPALITY_LAYER_URL);
  const parcelsService = useLayerQuery(PARCELS_PUBLIC_LAYER_URL);
  const { setChanged } = useFilterContext();
  const popUpContext = React.useContext(PropertyPopUpContext);
  const parcelLayerFeature = useAppSelector(store => store.parcelLayerData?.parcelLayerFeature);
  const zoom = useAppSelector(store => store.mapViewZoom) ?? zoomProp;

  const [baseLayers, setBaseLayers] = React.useState<BaseLayer[]>([]);
  const [showFilterBackdrop, setShowFilterBackdrop] = React.useState(true);
  const [activeBasemap, setActiveBasemap] = React.useState<BaseLayer | null>(null);
  const [bounds, setBounds] = React.useState<LatLngBounds>(defaultBounds);
  const [layerPopup, setLayerPopup] = React.useState<LayerPopupInformation>();
  const [geoFilter, setGeoFilter] = React.useState<IGeoSearchParams>({
    ...defaultFilterValues,
    includeAllProperties: keycloak.hasClaim(Claims.ADMIN_PROPERTIES),
  } as any);
  const [center, setCenter] = React.useState({ lat, lng });
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [layersOpen, setLayersOpen] = React.useState(false);

  useActiveFeatureLayer({
    selectedProperty,
    layerPopup,
    mapRef,
    parcelLayerFeature,
    setLayerPopup,
  });

  React.useEffect(() => {
    // fetch GIS base layers configuration from /public folder
    axios.get('/basemaps.json')?.then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

  React.useEffect(() => {
    // Set the middle of the map if there is a selected parcel.
    if (
      mapRef.current &&
      selectedProperty?.parcelDetail &&
      selectedProperty.parcelDetail?.longitude &&
      selectedProperty.parcelDetail?.latitude
    ) {
      setCenter({
        lng: +selectedProperty.parcelDetail.longitude,
        lat: +selectedProperty.parcelDetail.latitude,
      });
      dispatch(setMapViewZoom(MAX_ZOOM));
    }
  }, [dispatch, mapRef, selectedProperty?.parcelDetail]);

  React.useEffect(() => {
    // Store the current zoom level.
    dispatch(setMapViewZoom(zoom));
  }, [dispatch, zoom]);

  // TODO: refactor various zoom settings
  React.useEffect(() => {
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
    // Search button will always trigger filter changed (triggerFilterChanged is set to true when search button is clicked)
    if (!isEqualWith(geoFilter, filter, compareValues) || triggerFilterChanged) {
      dispatch(storePropertyDetail(null));
      setGeoFilter(getQueryParams(filter));
      setChanged(true);
      setTriggerFilterChanged(false);
    }
  };

  const handleBasemapToggle = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
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

  const handleMoveEnd = (e: LeafletEvent) => {
    const boundsData: LatLngBounds = e.target.getBounds();
    if (!isEqual(boundsData.getNorthEast(), boundsData.getSouthWest())) {
      setBounds(boundsData);
    }
  };

  const handleResize = () => {
    // The map has changed and needs to be redrawn and possibly zoomed and centered.
    mapRef.current?.leafletElement.invalidateSize();
    const z = mapRef.current?.leafletElement.getZoom();
    if (zoom !== z) mapRef.current?.leafletElement.setView(center, zoom);
  };

  return (
    <ReactResizeDetector handleWidth refreshMode="throttle" onResize={handleResize}>
      {() => {
        return (
          <Container fluid className={classNames('px-0 map', { narrow: sidebarSize === 'narrow' })}>
            <FilterBackdrop show={showFilterBackdrop} />
            {!disableMapFilterBar && (
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
                    setTriggerFilterChanged={setTriggerFilterChanged}
                    showAllAgencySelect={true}
                  />
                </Container>
              </Container>
            )}
            <Row className="g-0">
              <Col>
                {baseLayers?.length > 0 && (
                  <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggle} />
                )}

                {popUpContext.showBCEIDWarning && (
                  <GenericModal
                    message={displayMessage}
                    display={popUpContext.showBCEIDWarning}
                    handleOk={() => popUpContext.setBCEIDWarning(false)}
                  />
                )}
                <ReactLeafletMap
                  ref={mapRef}
                  center={center}
                  zoom={zoom}
                  onclick={showLocationDetails}
                  closePopupOnClick={interactive}
                  onmoveend={handleMoveEnd}
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
                        dispatch(storePropertyDetail(null));
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
              </Col>
            </Row>
          </Container>
        );
      }}
    </ReactResizeDetector>
  );
};

export default Map;
