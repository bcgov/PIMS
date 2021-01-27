import { FormikValues, getIn, setIn } from 'formik';
import { isMouseEventRecent, squareMetersToHectares } from 'utils';
import { AMINISTRATIVE_AREA_CODE_SET_NAME } from 'constants/API';
import { useState } from 'react';
import { IParcelLayerData, clearParcelLayerData } from 'reducers/parcelLayerDataSlice';
import { ILookupCode } from 'actions/lookupActions';
import { pidFormatter } from '../components/forms/subforms/PidPinForm';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import useCodeLookups from 'hooks/useLookupCodes';
import { toast } from 'react-toastify';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { getInitialValues } from 'features/mapSideBar/SidebarContents/LandForm';

interface IUseParcelLayerDataProps {
  formikRef: React.MutableRefObject<FormikValues | undefined>;
  agencyId: number;
  parcelId?: number | '';
  nameSpace?: string;
}

/**
 * Only autofill data if:
 * 1) layerdata and formikref are bot non-null/undefined
 * 2) either the layer pid or pin has a non-zero value
 * 3) the pid or pin are not equal to the initial values (indicating that the form has already been pre-populated)
 * @param layerData
 * @param formikRef
 * @param nameSpace
 */
const isFormInStateToSetLayerData = (
  layerData: IParcelLayerData | null,
  formikRef: React.MutableRefObject<FormikValues | undefined>,
  nameSpace: string,
) => {
  const formPid = getIn(formikRef?.current?.initialValues, `${nameSpace}.pid`)?.replace(/-/g, '');
  const formPin = getIn(formikRef?.current?.initialValues, `${nameSpace}.pin`);
  const pid = +layerData?.data.PID || +layerData?.data?.PID_NUMBER;
  return (
    !!formikRef.current &&
    !!layerData?.data &&
    ((pid > 0 && +formPid !== pid) || (+layerData.data.PIN > 0 && +formPin !== +layerData.data.PIN))
  );
};

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
  nameSpace: string,
  agencyId: number,
) => {
  if (isFormInStateToSetLayerData(layerData, formikRef, nameSpace)) {
    toast.dark('Autofilling form utilizing BC Geographic Warehouse data.', { autoClose: 7000 });
    const { values, setValues } = formikRef.current!;
    let newValues = { ...values };
    if (nameSpace) {
      newValues = setIn(newValues, nameSpace, {
        ...getInitialValues(),
        ...getIn(values, nameSpace),
      });
    }

    const layerParcelData = layerData!.data;

    //These fields are generic and used in both buildings and parcels
    newValues = setIn(
      newValues,
      `${nameSpace}.landArea`,
      squareMetersToHectares(+layerParcelData.FEATURE_AREA_SQM),
    );
    newValues = setIn(newValues, `${nameSpace}.latitude`, layerParcelData.CENTER.lat);
    newValues = setIn(newValues, `${nameSpace}.longitude`, layerParcelData.CENTER.lng);
    const administrativeArea = getAdminAreaFromLayerData(
      administrativeAreas,
      layerParcelData.MUNICIPALITY,
    );
    if (administrativeArea) {
      newValues = setIn(
        newValues,
        `${nameSpace}.address.administrativeArea`,
        administrativeArea.name,
      );
    }

    //parcel only fields.
    if (getIn(values, `${nameSpace}.pid`) !== undefined) {
      const pid = layerData?.data?.PID || layerData?.data?.PID_NUMBER?.toString();
      newValues = setIn(newValues, `${nameSpace}.pid`, !!pid ? pidFormatter(pid) : '');
      newValues = setIn(newValues, `${nameSpace}.pin`, layerParcelData.PIN || '');

      newValues = setIn(newValues, `${nameSpace}.agencyId`, agencyId);
      const searchAddress = getIn(values, `${nameSpace}.searchAddress`);
      if (searchAddress && getIn(newValues, `${nameSpace}.address.line1`) === '') {
        newValues = setIn(newValues, `${nameSpace}.address.line1`, searchAddress);
      }
      newValues = setIn(
        newValues,
        `${nameSpace}.searchPin`,
        getIn(values, `${nameSpace}.searchPin`),
      );
      newValues = setIn(
        newValues,
        `${nameSpace}.searchPid`,
        getIn(values, `${nameSpace}.searchPid`),
      );
      newValues = setIn(newValues, `${nameSpace}.searchAddress`, searchAddress);
    }
    setValues({ ...values, ...newValues });
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
      let match = _.find(administrativeAreas, { name: formattedLayerMunicipality });
      if (!match) {
        match = _.find(administrativeAreas, { name: splitLayerMunicipality[0].trim() });
      }
      return match;
    }
  }
};

/**
 * hook providing methods to update the parcel detail form using parcel layer data.
 */
const useParcelLayerData = ({
  formikRef,
  parcelId,
  nameSpace,
  agencyId,
}: IUseParcelLayerDataProps) => {
  const parcelLayerData = useSelector<RootState, IParcelLayerData | null>(
    state => state.parcelLayerData?.parcelLayerData,
  );
  const { getByType } = useCodeLookups();
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const dispatch = useDispatch();

  useDeepCompareEffect(() => {
    if (!!formikRef?.current && isMouseEventRecent(parcelLayerData?.e) && !!parcelLayerData?.data) {
      if (!parcelId) {
        setParcelFieldsFromLayerData(
          parcelLayerData,
          formikRef,
          getByType(AMINISTRATIVE_AREA_CODE_SET_NAME),
          nameSpace ?? '',
          agencyId,
        );
        dispatch(clearParcelLayerData());
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
        nameSpace ?? '',
        agencyId,
      ),
  };
};

export default useParcelLayerData;
