import * as API from 'constants/API';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import { FormikValues, getIn, setIn } from 'formik';
import { useState } from 'react';
import useCodeLookups from 'hooks/useLookupCodes';
import {
  useLayerQuery,
  PARCELS_LAYER_URL,
  handleParcelDataLayerResponse,
  saveParcelDataLayerResponse,
} from 'components/maps/leaflet/LayerPopup';
import { LatLng } from 'leaflet';
import { useDispatch } from 'react-redux';

interface IUseGeocoderProps {
  formikRef: React.MutableRefObject<FormikValues | undefined>;
  /**
   * function to call to lookup pid or pin data with pims and the parcel layer.
   */
  fetchPimsOrLayerParcel?: (
    pidOrPin: any,
    parcelLayerSearchCallback: () => void,
    nameSpace?: string | undefined,
  ) => void;
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
const useGeocoder = ({ formikRef, fetchPimsOrLayerParcel }: IUseGeocoderProps) => {
  const { lookupCodes } = useCodeLookups();
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);
  const [pidSelection, setPidSelection] = useState<IPidSelection>({ showPopup: false, geoPID: '' });
  const api = useApi();
  const dispatch = useDispatch();

  const handleGeocoderChanges = async (data: IGeocoderResponse, nameSpace?: string) => {
    if (!!formikRef?.current && data) {
      const currentValues = !!nameSpace
        ? { ...getIn(formikRef.current.values, nameSpace) }
        : { ...formikRef.current.values };
      const newValues = {
        ...currentValues,
        latitude: data.latitude,
        longitude: data.longitude,
        address: {
          ...getIn(formikRef.current.values, nameSpace ?? '').address,
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
        newValues.address.administrativeArea = administrativeArea.name;
      } else {
        newValues.address.administrativeArea = '';
      }

      const province = data.provinceCode
        ? lookupCodes.find(code => {
            return code.type === API.PROVINCE_CODE_SET_NAME && code.code === data.provinceCode;
          })
        : undefined;

      if (province) {
        newValues.address.provinceId = province.code;
        newValues.address.province = province.name;
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
      if (parcelPid?.length) {
        newValues.pid = parcelPid;
        const parcelLayerSearchCallback = () => {
          const response = parcelsService.findByPid(parcelPid);
          handleParcelDataLayerResponse(response, dispatch);
        };
        fetchPimsOrLayerParcel &&
          fetchPimsOrLayerParcel({ pid: parcelPid }, parcelLayerSearchCallback, nameSpace);
      } else {
        if (data.latitude && data.longitude) {
          parcelsService
            .findOneWhereContains({
              lat: data.latitude,
              lng: data.longitude,
            } as LatLng)
            .then(response => {
              const pid = getIn(response, 'features.0.properties.PID');
              //it is possible the geocoder will fail to get the pid but the parcel layer service request will succeed. In that case, double check that the pid doesn't exist within pims.
              if (pid) {
                const parcelLayerSearchCallback = () => {
                  const response = parcelsService.findByPid(pid);
                  handleParcelDataLayerResponse(response, dispatch);
                };
                fetchPimsOrLayerParcel &&
                  fetchPimsOrLayerParcel({ pid: pid }, parcelLayerSearchCallback, nameSpace);
              } else if (response?.features?.length > 0) {
                saveParcelDataLayerResponse(response, dispatch);
              } else {
                const updatedValues = setIn(
                  formikRef?.current?.values ?? {},
                  nameSpace || '',
                  newValues,
                );
                formikRef.current && formikRef.current.setValues(updatedValues);
              }
            });
        }
      }
    }
  };
  return { handleGeocoderChanges, pidSelection, setPidSelection };
};

export default useGeocoder;
