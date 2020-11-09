import * as React from 'react';
import {
  PropertyTypes,
  IBuilding,
  IParcel,
  IProperty,
  storeDraftParcelsAction,
} from 'actions/parcelsActions';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

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
const getDraftMarkers = (values: IParcel) => {
  const parcelMarkers: IDraftMarker[] = [
    {
      latitude: values.latitude,
      longitude: values.longitude,
      name: values.name.length ? values.name : 'New Parcel',
      propertyTypeId: PropertyTypes.DRAFT_PARCEL,
    },
  ];
  const buildingMarkers = values.buildings.map((building: IBuilding, index: number) => ({
    latitude: building.latitude,
    longitude: building.longitude,
    name: building.name.length ? building.name : `Building #${index + 1}`,
    propertyTypeId: PropertyTypes.DRAFT_BUILDING,
  }));
  return [...parcelMarkers, ...buildingMarkers].filter(
    marker => marker.latitude !== '' && marker.longitude !== '',
  );
};

/**
 * A hook that automatically syncs any updates to the lat/lngs of the parcel form with the map.
 * @param param0 The currently displayed list of properties on the map.
 */
const useDraftMarkerSynchronizer = ({ properties }: { properties: IProperty[] }) => {
  const { values } = useFormikContext<IParcel>();
  const dispatch = useDispatch();
  const nonDraftProperties = React.useMemo(
    () =>
      properties.filter((property: IProperty) => property.propertyTypeId <= PropertyTypes.BUILDING),
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
  const synchronizeMarkers = (values: IParcel, dbProperties: IProperty[]) => {
    const draftMarkers = getDraftMarkers(values);
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
    _.debounce((values: IParcel, properties: IProperty[]) => {
      synchronizeMarkers(values, properties);
    }, 400),
    [],
  );

  useDeepCompareEffect(() => synchronize(values, nonDraftProperties), [
    values,
    properties,
    synchronize,
  ]);

  return;
};

export default useDraftMarkerSynchronizer;
