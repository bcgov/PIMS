import React, { useState, useRef } from 'react';
import Map, { MapViewportChangeEvent } from '../../../components/maps/leaflet/Map';
import './MapView.scss';
import { Map as LeafletMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProperty, storeParcelDetail, IPropertyDetail } from 'actions/parcelsActions';
import { LeafletMouseEvent } from 'leaflet';
import useParamSideBar from '../../mapSideBar/hooks/useQueryParamSideBar';
import { saveClickLatLng as saveLeafletMouseEvent } from 'reducers/LeafletMouseSlice';
import * as API from 'constants/API';
import MapSideBarContainer from 'features/mapSideBar/containers/MapSideBarContainer';
import classNames from 'classnames';
import { FilterProvider } from 'components/maps/providers/FIlterProvider';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useCodeLookups from 'hooks/useLookupCodes';

/** rough center of bc Itcha Ilgachuz Provincial Park */
const defaultLatLng = {
  lat: 52.81604319154934,
  lng: -124.67285156250001,
};

// This could also come from the API, a local file, etc -OR- replacing the <select> fields with free text inputs.
// Hard-coding it here until further requirements say otherwise.
const fetchLotSizes = () => {
  return [1, 2, 5, 10, 50, 100, 200, 300, 400, 500, 1000, 10000];
};

interface MapViewProps {
  disableMapFilterBar?: boolean;
  disabled?: boolean;
  showParcelBoundaries?: boolean;
  onMarkerClick?: (obj: IProperty) => void;
  onMarkerPopupClosed?: (obj: IPropertyDetail) => void;
}

const MapView: React.FC<MapViewProps> = (props: MapViewProps) => {
  const lookupCodes = useCodeLookups();
  const properties = useSelector<RootState, IProperty[]>(state => [...state.parcel.parcels]);
  const [loadedProperties, setLoadedProperties] = useState(false);
  const mapRef = useRef<LeafletMap>(null);
  const propertyDetail = useSelector<RootState, IPropertyDetail | null>(
    state => state.parcel.parcelDetail,
  );
  const agencies = lookupCodes.getByType(API.AGENCY_CODE_SET_NAME);
  const administrativeAreas = lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME);

  const lotSizes = fetchLotSizes();
  const dispatch = useDispatch();

  const saveLatLng = (e: LeafletMouseEvent) => {
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  const { showSideBar, size } = useParamSideBar();

  const location = useLocation();
  const urlParsed = queryString.parse(location.search);
  const disableFilter = urlParsed.sidebar === 'true' ? true : false;
  return (
    <div className={classNames(showSideBar ? 'side-bar' : '', 'd-flex')}>
      <MapSideBarContainer
        refreshParcels={() => {
          mapRef.current?.leafletElement.fireEvent('clear');
        }}
        properties={properties}
      />
      <FilterProvider>
        <Map
          sidebarSize={size}
          lat={defaultLatLng.lat}
          lng={defaultLatLng.lng}
          properties={properties}
          selectedProperty={propertyDetail}
          agencies={agencies}
          administrativeAreas={administrativeAreas}
          lotSizes={lotSizes}
          onMarkerPopupClose={() => {
            dispatch(storeParcelDetail(null));
          }}
          onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
            if (!loadedProperties) {
              setLoadedProperties(true);
            }
          }}
          onMapClick={saveLatLng}
          disableMapFilterBar={disableFilter}
          interactive={!props.disabled}
          showParcelBoundaries={props.showParcelBoundaries ?? true}
          zoom={6}
          mapRef={mapRef}
        />
      </FilterProvider>
    </div>
  );
};

export default MapView;
