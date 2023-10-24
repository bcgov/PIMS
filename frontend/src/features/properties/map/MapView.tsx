import './MapView.scss';

import { IProperty, IPropertyDetail } from 'actions/parcelsActions';
import classNames from 'classnames';
import Map from 'components/maps/leaflet/Map';
import { FilterProvider } from 'components/maps/providers/FIlterProvider';
import { PropertyPopUpContextProvider } from 'components/maps/providers/PropertyPopUpProvider';
import * as API from 'constants/API';
import MapSideBarContainer from 'features/mapSideBar/containers/MapSideBarContainer';
import useCodeLookups from 'hooks/useLookupCodes';
import { LeafletMouseEvent } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { getFetchLookupCodeAction } from 'store/slices/hooks/lookupCodeActionCreator';
import { saveClickLatLng as saveLeafletMouseEvent } from 'store/slices/leafletMouseSlice';
import { storePropertyDetail } from 'store/slices/parcelSlice';

import useParamSideBar from '../../mapSideBar/hooks/useQueryParamSideBar';

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
  const dispatch = useAppDispatch();
  const properties = useAppSelector((store) => store.parcel.properties);
  const [loadedProperties, setLoadedProperties] = useState(false);
  const propertyDetail = useAppSelector((state) => state.parcel.propertyDetail);
  const agencies = lookupCodes.getByType(API.AGENCY_CODE_SET_NAME);
  const administrativeAreas = lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME);

  const lotSizes = fetchLotSizes();

  const saveLatLng = (e: LeafletMouseEvent) => {
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  const { showSideBar, size } = useParamSideBar();

  /** make sure lookup codes are updated when map is first loaded */
  useEffect(() => {
    getFetchLookupCodeAction()(dispatch);
  }, [dispatch]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlParsed: any = {};
  for (const [key, value] of queryParams.entries()) {
    urlParsed[key] = value;
  }
  const disableFilter = urlParsed.sidebar === 'true' ? true : false;
  return (
    <div className={classNames(showSideBar ? 'side-bar' : 'full-height', 'd-flex')}>
      <MapSideBarContainer properties={properties} />
      <FilterProvider>
        <PropertyPopUpContextProvider>
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
              dispatch(storePropertyDetail(null));
            }}
            onViewportChanged={() => {
              if (!loadedProperties) {
                setLoadedProperties(true);
              }
            }}
            onMapClick={saveLatLng}
            disableMapFilterBar={disableFilter}
            interactive={!props.disabled}
            showParcelBoundaries={props.showParcelBoundaries ?? true}
            zoom={6}
          />
        </PropertyPopUpContextProvider>
      </FilterProvider>
    </div>
  );
};

export default MapView;
