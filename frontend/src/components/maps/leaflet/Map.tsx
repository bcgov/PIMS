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
import { IProperty, IPropertyDetail } from 'actions/parcelsActions';
import { Container, Row, Col } from 'react-bootstrap';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { useDispatch, useSelector } from 'react-redux';
import { setMapViewZoom } from 'reducers/mapViewZoomSlice';
import { RootState } from 'reducers/rootReducer';
import { Feature } from 'geojson';
import { asProperty } from './mapUtils';
import { LegendControl } from './Legend/LegendControl';
import { useMediaQuery } from 'react-responsive';
import { useApi } from 'hooks/useApi';
import ReactResizeDetector from 'react-resize-detector';
import {
  municipalityLayerPopupConfig,
  MUNICIPALITY_LAYER_URL,
  parcelLayerPopupConfig,
  PARCELS_LAYER_URL,
} from './LayerPopup/constants';
import { isEmpty, isEqual } from 'lodash';
import {
  LayerPopupContent,
  LayerPopupTitle,
  PopupContentConfig,
} from './LayerPopup/LayerPopupContent';
import { useLayerQuery } from './LayerPopup/hooks/useLayerQuery';
import { saveParcelLayerData } from 'reducers/parcelLayerDataSlice';
import useActiveFeatureLayer from '../hooks/useActiveFeatureLayer';
import LayersControl from './LayersControl';
import { InventoryLayer } from './InventoryLayer';
import { PointFeature } from '../types';
import { IGeoSearchParams } from 'constants/API';
import { decimalOrUndefined, floatOrUndefined } from 'utils';
import { IPropertyFilter } from 'features/properties/filter/IPropertyFilter';
import { PropertyFilter } from 'features/properties/filter';
import { useFilterContext } from '../providers/FIlterProvider';

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
  propertyClassifications: ILookupCode[];
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
};

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
  propertyClassifications,
  administrativeAreas,
  lotSizes,
  selectedProperty,
  onMarkerClick,
  onMapClick,
  disableMapFilterBar,
  interactive = true,
  mapRef,
}) => {
  const dispatch = useDispatch();
  const [geoFilter, setGeoFilter] = useState<IGeoSearchParams>({});
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);
  const smallScreen = useMediaQuery({ maxWidth: 1800 });
  const { getAdministrativeAreaLatLng } = useApi();
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

  const zoomToAdministrativeArea = async (city: string) => {
    const center = await getAdministrativeAreaLatLng(city);
    if (center) {
      mapRef.current?.leafletElement.setZoomAround(center, 11);
    }
  };

  const handleMapFilterChange = async (filter: IPropertyFilter) => {
    if (filter.administrativeArea) {
      await zoomToAdministrativeArea(filter.administrativeArea);
    }
    setGeoFilter(getQueryParams(filter));
    setChanged(true);
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

  return (
    <ReactResizeDetector handleWidth>
      {({ width }: any) => {
        setMapWidth(width);
        return (
          <Container fluid className="px-0 map">
            {!disableMapFilterBar ? (
              <Container fluid className="px-0 map-filter-container">
                <Container className="px-0">
                  <PropertyFilter
                    defaultFilter={defaultFilterValues}
                    agencyLookupCodes={agencies}
                    adminAreaLookupCodes={administrativeAreas}
                    propertyClassifications={propertyClassifications}
                    onChange={handleMapFilterChange}
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
                  }}
                  onclick={showLocationDetails}
                  closePopupOnClick={interactive}
                  onzoomend={e => setZoom(e.sourceTarget.getZoom())}
                  ondragend={handleBounds}
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
                        bounds={layerPopup.bounds}
                      />
                    </Popup>
                  )}
                  <LegendControl />
                  <LayersControl />
                  <InventoryLayer
                    zoom={zoom}
                    bounds={bounds}
                    onMarkerClick={onSingleMarkerClick}
                    selected={selectedProperty}
                    filter={geoFilter}
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
