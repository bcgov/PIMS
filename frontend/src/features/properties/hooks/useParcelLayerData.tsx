import { FormikValues } from 'formik';
import { isMouseEventRecent, squareMetersToHectares } from 'utils';
import { AMINISTRATIVE_AREA_CODE_SET_NAME } from 'constants/API';
import { useState } from 'react';
import { IParcelLayerData } from 'reducers/parcelLayerDataSlice';
import { ILookupCode } from 'actions/lookupActions';
import { pidFormatter } from '../components/forms/subforms/PidPinForm';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import useCodeLookups from 'hooks/useLookupCodes';
import { toast } from 'react-toastify';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

interface IUseParcelLayerDataProps {
  formikRef: React.MutableRefObject<FormikValues | undefined>;
  parcelId?: number | '';
}

/**
 * Set the fields in the parcel form using the passed formik reference.
 * @param layerData The parcel layer data to use to set the data
 * @param formikRef The formik reference to the parcel detail form.
 * @param administrativeAreas the full list of administrative areas, used to find an admin area matching the code set.
 */
const setParcelFieldsFromLayerData = (
  layerData: IParcelLayerData | null,
  formikRef: React.MutableRefObject<FormikValues | undefined>,
  administrativeAreas: ILookupCode[],
) => {
  if (!!formikRef.current && !!layerData?.data) {
    const { setFieldValue } = formikRef.current;
    setFieldValue('pid', !!layerData.data.PID ? pidFormatter(layerData.data.PID) : '');
    setFieldValue('pin', layerData.data.PIN || '');
    layerData.data.FEATURE_AREA_SQM &&
      setFieldValue('landArea', squareMetersToHectares(+layerData.data.FEATURE_AREA_SQM));
    const administrativeArea = getAdminAreaFromLayerData(
      administrativeAreas,
      layerData.data.MUNICIPALITY,
    );
    if (administrativeArea) {
      setFieldValue('address.administrativeArea', administrativeArea.name);
    }
    if (!!layerData.data.CENTER?.lat && !!layerData.data.CENTER?.lng) {
      setFieldValue('latitude', layerData.data.CENTER.lat);
      setFieldValue('longitude', layerData.data.CENTER.lng);
    }
  }
};

/**
 * Using the administrative areas code set, find the matching municipality returned by the parcel layer, if present.
 * @param administrativeAreas the full list from the administrative areas code set.
 * @param layerMunicipality the municipality returned by the layer.
 */
const getAdminAreaFromLayerData = (
  administrativeAreas: ILookupCode[],
  layerMunicipality: string,
) => {
  let administrativeArea = _.find(administrativeAreas, { name: layerMunicipality });
  if (administrativeArea) {
    return administrativeArea;
  }
  if (!!layerMunicipality?.length) {
    const splitLayerMunicipality = layerMunicipality.split(',');
    if (splitLayerMunicipality.length === 2) {
      const formattedLayerMunicipality = `${splitLayerMunicipality[1].trim()} ${splitLayerMunicipality[0].trim()}`;
      return _.find(administrativeAreas, { name: formattedLayerMunicipality });
    }
  }
};

/**
 * hook providing methods to update the parcel detail form using parcel layer data.
 */
const useParcelLayerData = ({ formikRef, parcelId }: IUseParcelLayerDataProps) => {
  const parcelLayerData = useSelector<RootState, IParcelLayerData | null>(
    state => state.parcelLayerData?.parcelLayerData,
  );
  const { getByType } = useCodeLookups();
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  useDeepCompareEffect(() => {
    if (!!formikRef?.current && isMouseEventRecent(parcelLayerData?.e) && !!parcelLayerData?.data) {
      if (!parcelId) {
        toast.dark('Autofilling form utilizing BC Data Warehouse data.', { autoClose: 7000 });
        setParcelFieldsFromLayerData(
          parcelLayerData,
          formikRef,
          getByType(AMINISTRATIVE_AREA_CODE_SET_NAME),
        );
      } else {
        setShowOverwriteDialog(true);
      }
    }
  }, [formikRef, getByType, parcelId, parcelLayerData]);

  return {
    setShowOverwriteDialog,
    showOverwriteDialog,
    setParcelFieldsFromLayerData: () =>
      setParcelFieldsFromLayerData(
        parcelLayerData,
        formikRef,
        getByType(AMINISTRATIVE_AREA_CODE_SET_NAME),
      ),
  };
};

export default useParcelLayerData;
