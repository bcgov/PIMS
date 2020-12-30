import React, { useState, useRef } from 'react';
import Map, { MapViewportChangeEvent } from '../../../components/maps/leaflet/Map';
import './MapView.scss';
import { Map as LeafletMap } from 'react-leaflet';
import { fetchPropertyDetail } from 'actionCreators/parcelsActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  IProperty,
  storeParcelDetail,
  IPropertyDetail,
  PropertyTypes,
} from 'actions/parcelsActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
import { LeafletMouseEvent } from 'leaflet';
import useParamSideBar from '../../mapSideBar/hooks/useQueryParamSideBar';
import { saveClickLatLng as saveLeafletMouseEvent } from 'reducers/LeafletMouseSlice';
import * as API from 'constants/API';
import _ from 'lodash';
import MapSideBarContainer from 'features/mapSideBar/containers/MapSideBarContainer';
import classNames from 'classnames';
import { FilterProvider } from 'components/maps/providers/FIlterProvider';

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
  const properties = useSelector<RootState, IProperty[]>(state => [
    ...state.parcel.parcels,
    ...state.parcel.draftParcels,
  ]);
  const [loadedProperties, setLoadedProperties] = useState(false);
  const mapRef = useRef<LeafletMap>(null);
  const propertyDetail = useSelector<RootState, IPropertyDetail | null>(
    state => state.parcel.parcelDetail,
  );
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const propertyClassifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME && !!lookupCode.isVisible;
  });
  const administrativeAreas = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME;
  });
  const [selectedDraftProperty, setSelectedDraftProperty] = useState<IPropertyDetail | null>(null);

  const lotSizes = fetchLotSizes();
  const dispatch = useDispatch();

  const saveLatLng = (e: LeafletMouseEvent) => {
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  const { showSideBar } = useParamSideBar();
  return (
    <div className={classNames(showSideBar ? 'side-bar' : '', 'd-flex')}>
      <MapSideBarContainer
        refreshParcels={() => {
          mapRef.current?.leafletElement.fireEvent('clear');
        }}
        properties={properties}
      ></MapSideBarContainer>
      <FilterProvider>
        <Map
          lat={
            (propertyDetail?.parcelDetail?.latitude as number) ??
            selectedDraftProperty?.parcelDetail?.latitude ??
            defaultLatLng.lat
          }
          lng={
            (propertyDetail?.parcelDetail?.longitude as number) ??
            selectedDraftProperty?.parcelDetail?.longitude ??
            defaultLatLng.lng
          }
          properties={properties}
          selectedProperty={
            !!propertyDetail?.parcelDetail ? propertyDetail : (selectedDraftProperty as any)
          }
          agencies={agencies}
          propertyClassifications={propertyClassifications}
          administrativeAreas={administrativeAreas}
          lotSizes={lotSizes}
          onMarkerClick={
            props.onMarkerClick ??
            ((p, position) => {
              if (
                p.propertyTypeId !== undefined &&
                [PropertyTypes.BUILDING, PropertyTypes.PARCEL].includes(p.propertyTypeId)
              ) {
                p.id && dispatch(fetchPropertyDetail(p.id, p.propertyTypeId as any, position));
              } else {
                setSelectedDraftProperty({
                  propertyTypeId: p.propertyTypeId,
                  parcelDetail: { ...p },
                } as any);
              }
            })
          }
          onMarkerPopupClose={() => {
            setSelectedDraftProperty(null);
            dispatch(storeParcelDetail(null));
          }}
          onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
            if (!loadedProperties) {
              setLoadedProperties(true);
            }
          }}
          onMapClick={saveLatLng}
          disableMapFilterBar={props.disableMapFilterBar}
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
