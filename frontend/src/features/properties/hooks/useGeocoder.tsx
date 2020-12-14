import * as API from 'constants/API';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import { FormikValues, getIn } from 'formik';
import { useState } from 'react';
import useCodeLookups from 'hooks/useLookupCodes';
import {
  useLayerQuery,
  PARCELS_LAYER_URL,
  handleParcelDataLayerResponse,
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
      if (
        formikRef.current.values.pid &&
        parcelPid !== '' &&
        formikRef.current.values.pid !== parcelPid
      ) {
        setPidSelection({
          showPopup: true,
          geoPID: parcelPid.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3'),
        });
      } else if (formikRef.current.values.pid && parcelPid === '') {
        newValues.pid = formikRef.current.values.pid;
      } else {
        if (parcelPid?.length) {
          newValues.pid = parcelPid;
          const parcelLayerSearchCallback = () => {
            const response = parcelsService.findByPid(parcelPid);
            handleParcelDataLayerResponse(response, dispatch);
          };
          fetchPimsOrLayerParcel &&
            fetchPimsOrLayerParcel(parcelPid, parcelLayerSearchCallback, nameSpace);
        } else {
          if (data.latitude && data.longitude) {
            const parcelDataLayerResponse = parcelsService.findOneWhereContains({
              lat: data.latitude,
              lng: data.longitude,
            } as LatLng);
            handleParcelDataLayerResponse(parcelDataLayerResponse, dispatch);
          }
        }
      }
    }
  };
  return { handleGeocoderChanges, pidSelection, setPidSelection };
};

export default useGeocoder;
