import * as React from 'react';
import { PropertyTypes, IProperty, storeDraftParcelsAction } from 'actions/parcelsActions';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import debounce from 'lodash/debounce';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { RootState } from 'reducers/rootReducer';

interface IDraftMarker {
  latitude: number | '';
  longitude: number | '';
  name: string;
  propertyTypeId: PropertyTypes;
}

/**
 * Get a list of draft markers from the current form values.
 * As long as a parcel/building has both a lat and a lng it will be returned by this method.
 * @param values the current form values to extract lat/lngs from.
 */
const getDraftMarkers = (values: any) => {
  const markers: IDraftMarker[] = [
    {
      latitude: values.latitude,
      longitude: values.longitude,
      name: values.name?.length ? values.name : 'New Parcel',
      propertyTypeId:
        values.parcelId !== undefined ? PropertyTypes.DRAFT_BUILDING : PropertyTypes.DRAFT_PARCEL,
    },
  ];
  return markers.filter(marker => marker.latitude !== '' && marker.longitude !== '');
};

/**
 * A hook that automatically syncs any updates to the lat/lngs of the parcel form with the map.
 * @param param0 The currently displayed list of properties on the map.
 */
const useDraftMarkerSynchronizer = () => {
  const { values } = useFormikContext();
  const properties = useSelector<RootState, IProperty[]>(state => [
    ...state.parcel.parcels,
    ...state.parcel.draftParcels,
  ]);
  const dispatch = useDispatch();
  const nonDraftProperties = React.useMemo(
    () =>
      properties.filter(
        (property: IProperty) =>
          property.propertyTypeId !== undefined &&
          [PropertyTypes.BUILDING, PropertyTypes.PARCEL].includes(property.propertyTypeId),
      ),
    [properties],
  );

  React.useEffect(() => {
    return () => {
      dispatch(storeDraftParcelsAction([]));
    };
  }, [dispatch]);

  /**
   * Synchronize the markers that have been updated in the parcel form with the map, adding all new markers as drafts.
   * @param values the current form values
   * @param dbProperties the currently displayed list of (DB) map properties.
   */
  const synchronizeMarkers = (values: any, dbProperties: IProperty[]) => {
    const draftMarkers = values.data ? getDraftMarkers(values.data) : getDraftMarkers(values);
    if (draftMarkers.length) {
      const newDraftMarkers = _.filter(
        draftMarkers,
        (draftMarker: IProperty) =>
          _.find(dbProperties, {
            latitude: draftMarker.latitude,
            longitude: draftMarker.longitude,
          }) === undefined,
      );
      dispatch(storeDraftParcelsAction(newDraftMarkers as IProperty[]));
    } else {
      dispatch(storeDraftParcelsAction([]));
    }
  };

  const synchronize = useCallback(
    debounce((values: any, properties: IProperty[]) => {
      synchronizeMarkers(values, properties);
    }, 400),
    [],
  );

  useDeepCompareEffect(() => {
    synchronize(values, nonDraftProperties);
  }, [values, nonDraftProperties, synchronize]);

  return;
};

export default useDraftMarkerSynchronizer;
