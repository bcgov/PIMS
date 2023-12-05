import { ILookupCode } from 'actions/ILookupCode';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { AMINISTRATIVE_AREA_CODE_SET_NAME } from 'constants/API';
import { getInitialValues } from 'features/mapSideBar/SidebarContents/LandForm';
import { FormikValues, getIn, setIn } from 'formik';
import { useApi } from 'hooks/useApi';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import _ from 'lodash';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store';
import { clearParcelLayerData, IParcelLayerData } from 'store/slices/parcelLayerDataSlice';
import { isMouseEventRecent, squareMetersToHectares } from 'utils';

import { pidFormatter } from '../components/forms/subforms/PidPinForm';

interface IUseParcelLayerDataProps {
  formikRef: React.MutableRefObject<FormikValues | undefined>;
  agencyId?: number;
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
  agencyId?: number,
  ltsa?: ILTSAOrderModel,
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
    newValues = setIn(
      newValues,
      `${nameSpace}.landLegalDescription`,
      ltsa?.order.orderedProduct.fieldedData.descriptionsOfLand[0].fullLegalDescription ?? '',
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
      if (searchAddress) {
        newValues = setIn(newValues, `${nameSpace}.address.line1`, searchAddress);
      } else {
        newValues = setIn(newValues, `${nameSpace}.address.line1`, '');
      }
      newValues = setIn(newValues, `${nameSpace}.searchPin`, '');
      newValues = setIn(newValues, `${nameSpace}.searchPid`, '');
      newValues = setIn(newValues, `${nameSpace}.searchAddress`, '');
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
  const administrativeArea = _.find(administrativeAreas, { name: layerMunicipality });
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
  const api = useApi();
  const parcelLayerData = useAppSelector((store) => store.parcelLayerData?.parcelLayerData);
  const { getByType } = useCodeLookups();
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const dispatch = useAppDispatch();
  const keycloak = useKeycloakWrapper();

  useDeepCompareEffect(() => {
    // Define an async function to fetch LTSA data
    const fetchLTSAData = async () => {
      if (
        !!formikRef?.current &&
        isMouseEventRecent(parcelLayerData?.e) &&
        !!parcelLayerData?.data
      ) {
        if (!parcelId) {
          const pid = parcelLayerData?.data?.PID || parcelLayerData?.data?.PID_NUMBER?.toString();
          const ltsaResponseData = await api.getLTSA(pid);
          // Now that LTSA data is available, call setParcelFieldsFromLayerData
          setParcelFieldsFromLayerData(
            parcelLayerData,
            formikRef,
            getByType(AMINISTRATIVE_AREA_CODE_SET_NAME),
            nameSpace ?? '',
            agencyId ?? keycloak.agencyId,
            ltsaResponseData,
          );
          dispatch(clearParcelLayerData());
        } else {
          setShowOverwriteDialog(true);
        }
      }
    };

    // Call the async function
    fetchLTSAData();
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
        agencyId ?? keycloak.agencyId,
      ),
  };
};

export default useParcelLayerData;
