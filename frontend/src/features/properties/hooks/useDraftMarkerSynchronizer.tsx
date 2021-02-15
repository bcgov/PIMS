import * as React from 'react';
import { storeDraftParcelsAction } from 'actions/parcelsActions';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import debounce from 'lodash/debounce';
import { useFormikContext, getIn } from 'formik';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { RootState } from 'reducers/rootReducer';
import { PointFeature } from 'components/maps/types';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * Get a list of draft markers from the current form values.
 * As long as a parcel/building has both a lat and a lng it will be returned by this method.
 * @param values the current form values to extract lat/lngs from.
 * @param initialValues the original form values, used to exclude unchanged lat/lngs
 * @param nameSpace path within above objects to extract lat/lngs
 */
const getDraftMarkers = (values: any, initialValues: any, nameSpace: string) => {
  values = getIn(values, nameSpace);
  initialValues = getIn(initialValues, nameSpace);
  if (
    values?.latitude === '' ||
    values?.longitude === '' ||
    (values?.latitude === initialValues?.latitude && values?.longitude === initialValues?.longitude)
  ) {
    return [];
  }
  return [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [+values.longitude, +values.latitude],
      },
      properties: {
        id: 0,
        name: values.name?.length ? values.name : 'New Parcel',
        propertyTypeId:
          values.parcelId !== undefined ? PropertyTypes.DRAFT_BUILDING : PropertyTypes.DRAFT_PARCEL,
      },
    },
  ];
};

/**
 * A hook that automatically syncs any updates to the lat/lngs of the parcel form with the map.
 * @param param0 The currently displayed list of properties on the map.
 */
const useDraftMarkerSynchronizer = (nameSpace: string) => {
  const { values, initialValues } = useFormikContext();
  const properties = useSelector<RootState, PointFeature[]>(state => [
    ...state.parcel.draftParcels,
  ]);
  const dispatch = useDispatch();
  const nonDraftProperties = React.useMemo(
    () =>
      properties.filter(
        (property: PointFeature) =>
          property.properties.propertyTypeId !== undefined &&
          [PropertyTypes.BUILDING, PropertyTypes.PARCEL].includes(
            property.properties.propertyTypeId,
          ),
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
   * @param initialValues the initial form values
   * @param dbProperties the currently displayed list of (DB) map properties.
   * @param nameSpace the path to extract lat/lng values from
   */
  const synchronizeMarkers = (
    values: any,
    initialValues: any,
    dbProperties: PointFeature[],
    nameSpace: string,
  ) => {
    const draftMarkers = getDraftMarkers(values, initialValues, nameSpace);
    if (draftMarkers.length) {
      const newDraftMarkers = _.filter(
        draftMarkers,
        (draftMarker: PointFeature) =>
          _.find(
            dbProperties,
            dbProperty =>
              dbProperty.geometry.coordinates[0] === draftMarker.geometry.coordinates[0] &&
              dbProperty.geometry.coordinates[1] === draftMarker.geometry.coordinates[1],
          ) === undefined,
      );
      dispatch(storeDraftParcelsAction(newDraftMarkers as PointFeature[]));
    } else {
      dispatch(storeDraftParcelsAction([]));
    }
  };

  const synchronize = useCallback(
    debounce((values: any, initialValues: any, properties: PointFeature[], nameSpace: string) => {
      synchronizeMarkers(values, initialValues, properties, nameSpace);
    }, 400),
    [],
  );

  useDeepCompareEffect(() => {
    synchronize(values, initialValues, nonDraftProperties, nameSpace);
  }, [values, initialValues, nonDraftProperties, synchronize, nameSpace]);

  return;
};

export default useDraftMarkerSynchronizer;
