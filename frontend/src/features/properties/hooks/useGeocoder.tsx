import * as API from 'constants/API';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import { FormikValues } from 'formik';
import { useState } from 'react';
import useCodeLookups from 'hooks/useLookupCodes';
import {
  useLayerQuery,
  PARCELS_LAYER_URL,
  handleParcelDataLayerResponse,
} from 'components/maps/leaflet/LayerPopup';
import { LatLng } from 'leaflet';
import { useDispatch } from 'react-redux';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface IUseGeocoderProps {
  formikRef: React.MutableRefObject<FormikValues | undefined>;
}

export interface IPidSelection {
  /**
   * showPopup for when the geocoder pid does not match the current pid.
   */
  showPopup: boolean;
  /**
   * The pid returned by the geocoder for the current civil address.
   */
  geoPID: string;
}

/**
 * useGeocoder hook searches the geocoder api service whenever the civil address changes.
 * The parcel data layer may be searched based on the response latitude/longitude.
 * @param param0
 */
const useGeocoder = ({ formikRef }: IUseGeocoderProps) => {
  const { lookupCodes } = useCodeLookups();
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);
  const [pidSelection, setPidSelection] = useState<IPidSelection>({ showPopup: false, geoPID: '' });
  const api = useApi();
  const dispatch = useDispatch();
  const handleGeocoderChanges = async (data: IGeocoderResponse) => {
    let parcelDataLayerResponse:
      | Promise<FeatureCollection<Geometry, GeoJsonProperties>>
      | undefined;
    if (data.latitude && data.longitude) {
      parcelDataLayerResponse = parcelsService.findOneWhereContains({
        lat: data.latitude,
        lng: data.longitude,
      } as LatLng);
      handleParcelDataLayerResponse(parcelDataLayerResponse, dispatch);
    }
    if (!!formikRef?.current && data) {
      const newValues = {
        ...formikRef.current.values,
        latitude: data.latitude,
        longitude: data.longitude,
        address: {
          ...formikRef.current.values.data.address,
          line1: data.fullAddress,
        },
      };

      const administrativeArea = data.administrativeArea
        ? lookupCodes.find(code => {
            return (
              code.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME &&
              code.name === data.administrativeArea
            );
          })
        : undefined;

      if (administrativeArea) {
        newValues.data.address.administrativeArea = administrativeArea.name;
      } else {
        newValues.data.address.administrativeArea = '';
      }

      const province = data.provinceCode
        ? lookupCodes.find(code => {
            return code.type === API.PROVINCE_CODE_SET_NAME && code.code === data.provinceCode;
          })
        : undefined;

      if (province) {
        newValues.data.address.provinceId = province.code;
        newValues.data.address.province = province.name;
      }

      // Ask geocoder for PIDs associated with this address
      let parcelPid: string = '';
      if (data.siteId) {
        try {
          const { pids } = await api.getSitePids(data.siteId);
          parcelPid = pids && pids.length > 0 ? pids[0] : '';
        } catch (error) {
          console.error('Failed to get pids');
        }
      }
      if (
        formikRef.current.values.data.pid &&
        parcelPid !== '' &&
        formikRef.current.values.data.pid !== parcelPid
      ) {
        setPidSelection({
          showPopup: true,
          geoPID: parcelPid.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3'),
        });
      } else if (formikRef.current.values.data.pid && parcelPid === '') {
        newValues.pid = formikRef.current.values.data.pid;
      } else {
        newValues.pid = parcelPid;
        // Only populate the form with the parcel data layer if the parcelPid is being set and we don't already have the data layer response using the lat/lng.
        if (!parcelDataLayerResponse) {
          parcelDataLayerResponse = parcelsService.findByPid(parcelPid);
          handleParcelDataLayerResponse(parcelDataLayerResponse, dispatch);
        }
      }

      // update form with values returned from geocoder
      newValues.agencyId = formikRef.current.values.data.agencyId;
      formikRef.current.setValues({ ...formikRef.current.values, data: { ...newValues } });
    }
  };
  return { handleGeocoderChanges, pidSelection, setPidSelection };
};

export default useGeocoder;
