import './Map.scss';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngBounds } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';
import { ParcelPopupView } from '../ParcelPopupView';
import { Container, Row } from 'react-bootstrap';
import MapFilterBar, { MapFilterChangeEvent } from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';
import { decimalOrNull, floatOrNull } from 'utils';

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
  parcels: IParcel[];
  agencies: ILookupCode[];
  propertyClassifications: ILookupCode[];
  lotSizes: number[];
  activeParcel?: IParcelDetail | null;
  onParcelClick?: (obj: IParcel) => void;
  onPopupClose?: (obj: IParcel) => void;
  onViewportChanged?: (e: MapViewportChangeEvent) => void;
  disableMapFilterBar?: boolean;
};

const Map: React.FC<MapProps> = props => {
  // props
  const { parcels, activeParcel, onParcelClick, onPopupClose, onViewportChanged } = props;
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
    axios.get('basemaps.json').then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

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
        >
          {activeBasemap && (
            <TileLayer attribution={activeBasemap.attribution} url={activeBasemap.url} />
          )}

          {parcels &&
            parcels.map(parcel => {
              return (
                <Marker
                  key={parcel.id}
                  position={[parcel.latitude, parcel.longitude]}
                  onClick={() => onParcelClick?.(parcel)}
                />
              );
            })}

          {activeParcel && (
            <Popup
              position={[activeParcel.latitude, activeParcel.longitude]}
              offset={[0, -25]}
              onClose={() => onPopupClose?.(activeParcel)}
            >
              <ParcelPopupView parcelDetail={activeParcel} />
            </Popup>
          )}
        </LeafletMap>
      </Row>
    </Container>
  );
};

export default Map;
