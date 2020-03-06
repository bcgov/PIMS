import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngBounds } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.scss';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';
import { ParcelPopupView } from '../ParcelPopupView';
import { Container, Row } from 'react-bootstrap';
import MapNavBar from '../MapNavBar';
import MapFilterBar from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';
import BasemapToggle, { BasemapToggleEvent, BaseLayer } from '../BasemapToggle';

export type MapFilterModel = {
  bounds: LatLngBounds | null;
  agencyId: number | null;
  propertyClassificationId: number | null;
};

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  parcels: IParcel[];
  agencies: ILookupCode[];
  propertyClassifications: ILookupCode[];
  activeParcel?: IParcelDetail | null;
  onParcelClick?: (obj: IParcel) => void;
  onPopupClose?: (obj: IParcel) => void;
  onViewportChanged?: (mapFilterModel: MapFilterModel) => void;
};

const Map: React.FC<MapProps> = props => {
  // props
  const { parcels, activeParcel } = props;
  const mapRef = useRef<LeafletMap>(null);
  const [agencyId, setAgencyId] = useState<number | null>(null);
  const [propertyClassificationId, setPropertyClassificationId] = useState<number | null>(null);
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [activeBasemap, setActiveBasemap] = useState<BaseLayer | null>(null);

  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current?.leafletElement.getBounds();
  };
  const handleParcelClick = (parcel: IParcel) => {
    if (props.onParcelClick) {
      props.onParcelClick(parcel);
    }
  };
  const handlePopupClose = (parcel: IParcel) => {
    if (props.onPopupClose) {
      props.onPopupClose(parcel);
    }
  };
  const handleViewportChanged = () => {
    const e = getBounds();
    if (props.onViewportChanged) {
      const mapFilterModel: MapFilterModel = {
        bounds: e,
        agencyId: agencyId,
        propertyClassificationId: propertyClassificationId,
      };
      props.onViewportChanged(mapFilterModel);
    }
  };
  useEffect(() => {
    handleViewportChanged();
  }, [agencyId, propertyClassificationId]);

  // fetch GIS base layers configuration from /public folder
  useEffect(() => {
    axios.get('basemaps.json').then(result => {
      setBaseLayers(result.data?.basemaps);
      setActiveBasemap(result.data?.basemaps?.[0]);
    });
  }, []);

  const handleAgencyChanged = (agencyId: number | null) => {
    setAgencyId(agencyId);
  };
  const handlePropertyClassificationChanged = (propertyClassificationId: number | null) => {
    setPropertyClassificationId(propertyClassificationId);
  };
  const handleBasemapToggled = (e: BasemapToggleEvent) => {
    const { previous, current } = e;
    setBaseLayers([current, previous]);
    setActiveBasemap(current);
  };

  return (
    <Container fluid={true}>
      <Row style={{ width: '100%', position: 'absolute' }}>
        <MapNavBar />
        <MapFilterBar
          agencyLookupCodes={props.agencies}
          propertyClassifications={props.propertyClassifications}
          onSelectAgency={handleAgencyChanged}
          onSelectPropertyClassification={handlePropertyClassificationChanged}
        />
        {baseLayers?.length > 0 && (
          <BasemapToggle baseLayers={baseLayers} onToggle={handleBasemapToggled} />
        )}
        <LeafletMap
          ref={mapRef}
          center={[props.lat, props.lng]}
          zoom={props.zoom}
          whenReady={() => handleViewportChanged()}
          onViewportChanged={() => handleViewportChanged()}
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
                  onClick={() => handleParcelClick(parcel)}
                />
              );
            })}

          {activeParcel && (
            <Popup
              position={[activeParcel.latitude, activeParcel.longitude]}
              offset={[0, -25]}
              onClose={() => handlePopupClose(activeParcel)}
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
