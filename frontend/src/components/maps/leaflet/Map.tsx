import './Map.scss';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngBounds, LeafletMouseEvent } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { IParcel, IParcelDetail, IProperty, IPropertyDetail } from 'actions/parcelsActions';
import { ParcelPopupView } from '../ParcelPopupView';
import { Container, Row } from 'react-bootstrap';
import MapFilterBar, { MapFilterChangeEvent } from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { decimalOrNull, floatOrNull } from 'utils';
import { PopupView } from '../PopupView';

export type MapViewportChangeEvent = {
  bounds: LatLngBounds | null;
  filter?: {
    address: string;
    /** comma-separated list of agencies to filter by */
    agencies: string | null;
    classificationId: number | null;
    minLotSize: number | null;
    maxLotSize: number | null;
  };
};

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
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
  disabled?: boolean;
};

const Map: React.FC<MapProps> = props => {
  // props
  const {
    properties,
    selectedProperty,
    onMarkerClick,
    onMarkerPopupClose,
    onViewportChanged,
  } = props;
  const mapRef = useRef<LeafletMap>(null);
  const [mapFilter, setMapFilter] = useState<MapFilterChangeEvent>({
    address: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
  });
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);

  if (props.disabled) {
    const map = mapRef.current?.leafletElement;
    if (map) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) map.tap.disable();
    }
  }
  // --- Internal functions and event handlers
  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current?.leafletElement.getBounds();
  };

  const handleViewportChange = () => {
    const bounds = getBounds();
    const { address, agencies, classificationId, minLotSize, maxLotSize } = mapFilter;
    const e: MapViewportChangeEvent = {
      bounds,
      filter: {
        address,
        agencies: agencies,
        classificationId: decimalOrNull(classificationId),
        minLotSize: floatOrNull(minLotSize),
        maxLotSize: floatOrNull(maxLotSize),
      },
    };
    onViewportChanged?.(e);
  };

  const handleMapFilterChange = (e: MapFilterChangeEvent) => {
    setMapFilter(e);
  };

  const handleBasemapToggle = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
  };

  // --- Effects AKA network requests
  useEffect(() => {
    handleViewportChange();
  }, [mapFilter]);

  useEffect(() => {
    // fetch GIS base layers configuration from /public folder
    axios.get('/basemaps.json').then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

  // we need to namespace the keys as IDs are not enough here.
  // the same ID could be found on both the parcel collection and building collection
  const generateKey = (p: IProperty) => `${p.propertyTypeId === 0 ? 'parcel' : 'building'}-${p.id}`;

  const renderMarker = (p: IProperty) => (
    <Marker
      key={generateKey(p)}
      position={[p.latitude, p.longitude]}
      onClick={(e: any) => onMarkerClick?.(p)}
    />
  );

  const renderPopup = (item: IPropertyDetail) => {
    const { propertyTypeId, parcelDetail } = item;
    if (!parcelDetail) {
      return null;
    }
    return (
      <Popup
        position={[parcelDetail.latitude, parcelDetail.longitude]}
        offset={[0, -25]}
        onClose={() => !props?.disabled && onMarkerPopupClose?.(item)}
        closeButton={!props.disabled}
      >
        <PopupView
          propertyTypeId={propertyTypeId}
          propertyDetail={parcelDetail}
          disabled={props.disabled}
        />
      </Popup>
    );
  };

  return (
    <Container fluid={true}>
      <Row>
        {!props.disableMapFilterBar ? (
          <MapFilterBar
            agencyLookupCodes={props.agencies}
            propertyClassifications={props.propertyClassifications}
            lotSizes={props.lotSizes}
            onFilterChange={handleMapFilterChange}
          />
        ) : null}
        {baseLayers?.length > 0 && (
          <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggle} />
        )}
        <LeafletMap
          ref={mapRef}
          center={[props.lat, props.lng]}
          zoom={props.zoom}
          whenReady={handleViewportChange}
          onViewportChanged={handleViewportChange}
          onpreclick={props.onMapClick}
          closePopupOnClick={!props.disabled}
        >
          {activeBasemap && (
            <TileLayer attribution={activeBasemap.attribution} url={activeBasemap.url} />
          )}
          {properties && properties.map(renderMarker)}
          {selectedProperty && renderPopup(selectedProperty)}
        </LeafletMap>
      </Row>
    </Container>
  );
};

export default Map;
