import './Map.scss';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngBounds, LeafletMouseEvent, LeafletEvent, Icon, DivIcon } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup, WMSTileLayer } from 'react-leaflet';
import { IProperty, IPropertyDetail } from 'actions/parcelsActions';
import { Container, Row, Col } from 'react-bootstrap';
import MapFilterBar, { MapFilterChangeEvent } from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { decimalOrNull, floatOrNull } from 'utils';
import { PopupView } from '../PopupView';
import { useDispatch, useSelector } from 'react-redux';
import { setMapViewZoom, resetMapViewZoom } from 'reducers/mapViewZoomSlice';
import { RootState } from 'reducers/rootReducer';
import { BBox } from 'geojson';
import { createPoints, PointFeature, asProperty } from './mapUtils';
import PointClusterer from './PointClusterer';
import { ICluster } from 'hooks';

export type MapViewportChangeEvent = {
  bounds: LatLngBounds | null;
  filter?: {
    address: string;
    municipality: string;
    projectNumber: string;
    /** comma-separated list of agencies to filter by */
    agencies: string | null;
    classificationId: number | null;
    minLotSize: number | null;
    maxLotSize: number | null;
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
  selectedProperty?: IPropertyDetail | null;
  onMarkerClick?: (obj: IProperty) => void;
  onMarkerPopupClose?: (obj: IPropertyDetail) => void;
  onViewportChanged?: (e: MapViewportChangeEvent) => void;
  onMapClick?: (e: LeafletMouseEvent) => void;
  disableMapFilterBar?: boolean;
  interactive?: boolean;
  showParcelBoundaries?: boolean;
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
  showParcelBoundaries = true,
}) => {
  // state and refs
  const dispatch = useDispatch();
  const mapRef = useRef<LeafletMap>(null);
  const [mapFilter, setMapFilter] = useState<MapFilterChangeEvent>({
    searchBy: 'address',
    address: '',
    municipality: '',
    projectNumber: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
  });
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);

  //do not jump to map coordinates if we have an existing map but no parcel details.
  if (mapRef.current && !selectedProperty?.parcelDetail) {
    lat = (mapRef.current.props.center as Array<number>)[0];
    lng = (mapRef.current.props.center as Array<number>)[1];
  }
  const lastZoom = useSelector<RootState, number>(state => state.mapViewZoom) ?? zoomProp;
  useEffect(() => {
    dispatch(resetMapViewZoom());
  }, [dispatch]);

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
      address,
      municipality,
      projectNumber,
      agencies,
      classificationId,
      minLotSize,
      maxLotSize,
    } = filter;
    const e: MapViewportChangeEvent = {
      bounds,
      filter: {
        address,
        municipality,
        projectNumber,
        agencies: agencies,
        classificationId: decimalOrNull(classificationId),
        minLotSize: floatOrNull(minLotSize),
        maxLotSize: floatOrNull(maxLotSize),
      },
    };
    onViewportChanged?.(e);
  };

  const onZoomEnd = (event: LeafletEvent) => dispatch(setMapViewZoom(event.target._zoom));

  const handleMapFilterChange = (e: MapFilterChangeEvent) => {
    setMapFilter(e);
    handleViewportChange(e);
  };

  const handleBasemapToggle = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
  };

  const onSingleMarkerClick = (point: PointFeature) => {
    onMarkerClick?.(asProperty(point));
  };

  const onClusterClick = (cluster: ICluster, expansionZoom: number) => {
    // zoom to cluster
    const [longitude, latitude] = cluster?.geometry?.coordinates;
    const leafletMap = mapRef?.current?.leafletElement;
    leafletMap?.setView([latitude, longitude], expansionZoom, {
      animate: true,
    });
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
  const updateMap = () => {
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
  };

  useEffect(() => {
    updateMap();
  }, []);

  const renderPopup = (item: IPropertyDetail) => {
    const { propertyTypeId, parcelDetail } = item;
    if (!parcelDetail) {
      return null;
    }
    return (
      <Popup
        position={[parcelDetail.latitude as number, parcelDetail.longitude as number]}
        offset={[0, -25]}
        onClose={() => onMarkerPopupClose?.(item)}
        closeButton={interactive}
      >
        <PopupView
          propertyTypeId={propertyTypeId}
          propertyDetail={parcelDetail}
          disabled={!interactive}
        />
      </Popup>
    );
  };

  // return map
  return (
    <Container fluid className="px-0">
      {!disableMapFilterBar ? (
        <Container fluid className="px-0 map-filter-container">
          <Container className="px-0">
            <MapFilterBar
              agencyLookupCodes={agencies}
              propertyClassifications={propertyClassifications}
              lotSizes={lotSizes}
              onFilterChange={handleMapFilterChange}
            />
          </Container>
        </Container>
      ) : null}
      <Row noGutters>
        <Col>
          {baseLayers?.length > 0 && (
            <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggle} />
          )}
          <LeafletMap
            ref={mapRef}
            center={[lat, lng]}
            zoom={lastZoom}
            whenReady={() => {
              handleViewportChange(mapFilter);
            }}
            onViewportChanged={() => {
              handleViewportChange(mapFilter);
            }}
            onpreclick={onMapClick}
            closePopupOnClick={interactive}
            onzoomend={onZoomEnd}
            onmoveend={updateMap}
          >
            {activeBasemap && (
              <TileLayer
                attribution={activeBasemap.attribution}
                url={activeBasemap.url}
                zIndex={0}
              />
            )}
            {showParcelBoundaries && (
              <WMSTileLayer
                url="https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows?"
                layers="pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
                transparent={true}
                format="image/png"
                zIndex={10}
              />
            )}
            <PointClusterer
              points={points}
              zoom={zoom}
              bounds={bounds}
              onMarkerClick={onSingleMarkerClick}
              onClusterClick={onClusterClick}
            />
            {selectedProperty && renderPopup(selectedProperty)}
          </LeafletMap>
        </Col>
      </Row>
    </Container>
  );
};

export default Map;
