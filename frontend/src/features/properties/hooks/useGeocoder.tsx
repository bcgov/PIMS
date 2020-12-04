import * as API from 'constants/API';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import { FormikValues, setIn, getIn } from 'formik';
import { useState } from 'react';
import useCodeLookups from 'hooks/useLookupCodes';
import {
  useLayerQuery,
  PARCELS_LAYER_URL,
  handleParcelDataLayerResponse,
} from 'components/maps/leaflet/LayerPopup';
import { LatLng } from 'leaflet';
import { useDispatch } from 'react-redux';
import { fetchParcelsDetail } from 'actionCreators/parcelsActionCreator';
import { toast } from 'react-toastify';
import _ from 'lodash';

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

  const updateForm = (newValues: any, nameSpace?: string) => {
    if (!!formikRef?.current) {
      // update form with values returned from geocoder
      newValues.agencyId = formikRef.current.values.data.agencyId;
      if (!!nameSpace) {
        const { resetForm, values } = formikRef.current;
        resetForm({ values: setIn(values, nameSpace, newValues) });
      } else {
        formikRef.current.setValues(newValues);
      }
    }
  };

  const fetchPimsParcelByPid = (newValues: any, parcelPid: string, nameSpace?: string) => {
    updateForm(newValues, nameSpace);
    fetchParcelsDetail({ pid: parcelPid } as any)(dispatch).then(resp => {
      const matchingParcel: any = resp?.data?.length ? _.first(resp?.data) : undefined;
      if (!!nameSpace && !!formikRef?.current?.values && !!matchingParcel?.id) {
        const { resetForm, values } = formikRef.current;
        resetForm({ values: setIn(values, nameSpace, matchingParcel) });
        toast.dark('Found matching parcel within PIMS. Form data will be pre-populated.', {
          autoClose: 7000,
        });
      } else {
        const parcelDataLayerResponse = parcelsService.findByPid(parcelPid);
        handleParcelDataLayerResponse(parcelDataLayerResponse, dispatch);
      }
    });
  };

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
          fetchPimsParcelByPid(newValues, parcelPid, nameSpace);
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
