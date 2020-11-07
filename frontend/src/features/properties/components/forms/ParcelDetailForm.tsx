import * as React from 'react';
import { Row, Col, Tab } from 'react-bootstrap';
import PidPinForm from './subforms/PidPinForm';
import InformationForm from './subforms/InformationForm';
import AddressForm from './subforms/AddressForm';
import LatLongForm from './subforms/LatLongForm';
import SumFinancialsForm from './subforms/SumFinancialsForm';
import EvaluationForm from './subforms/EvaluationForm';
import { useFormikContext } from 'formik';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import useCodeLookups from 'hooks/useLookupCodes';
import * as API from 'constants/API';
import {
  ParcelDetailTabs,
  IPidSelection,
} from 'features/properties/containers/ParcelDetailContainer';

import PagedBuildingForms from './subforms/PagedBuildingForms';
import { IParcel } from 'actions/parcelsActions';
import GenericModal from 'components/common/GenericModal';
import './ParcelDetailForm.scss';
import { isTabInError } from 'components/common/tabValidation';
import LandForm from './subforms/LandForm';
import ErrorTabs from 'components/common/ErrorTabs';

interface IParcelDetailFormProps {
  disabled: boolean;
  allowEdit: boolean;
  formikRef: any;
  setPidSelection: (value: IPidSelection) => void;
  pidSelection: IPidSelection;
  currentTab: ParcelDetailTabs;
  setCurrentTab: (tab: ParcelDetailTabs) => void;
  setMovingPinNameSpace: (nameSpace: string) => void;
  isAdmin?: boolean;
}

const ParcelDetailForm: React.FunctionComponent<IParcelDetailFormProps> = ({
  disabled,
  allowEdit,
  formikRef,
  setPidSelection,
  pidSelection,
  currentTab,
  setCurrentTab,
  setMovingPinNameSpace,
  isAdmin,
}) => {
  const formikProps = useFormikContext<IParcel>();
  const { lookupCodes, getOptionsByType } = useCodeLookups();
  const api = useApi();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);

  const handleGeocoderChanges = async (data: IGeocoderResponse) => {
    if (!!formikRef?.current && data) {
      const newValues = {
        ...formikRef.current.values,
        latitude: data.latitude,
        longitude: data.longitude,
        address: {
          ...formikRef.current.values.address,
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
        newValues.pid = parcelPid;
      }

      // update form with values returned from geocoder
      formikRef.current.setValues(newValues);
    }
  };

  return (
    <ErrorTabs currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <Tab
        title="Parcel"
        eventKey={ParcelDetailTabs.parcel}
        tabClassName={
          Object.keys(formikProps.touched).length
            ? isTabInError(formikProps.errors, ParcelDetailTabs.parcel)
            : ''
        }
      >
        <Row noGutters>
          <Col md={6}>
            {pidSelection.showPopup && (
              <GenericModal
                cancelButtonText={`Use original PID ${formikRef.current?.values.pid}`}
                okButtonText={`Use GeoCoder PID ${pidSelection.geoPID}`}
                handleOk={() => {
                  formikRef.current?.setFieldValue('pid', pidSelection.geoPID);
                  setPidSelection({ showPopup: false, geoPID: '' });
                }}
                handleCancel={() => {
                  setPidSelection({ showPopup: false, geoPID: '' });
                }}
                title="Conflicting PIDs found"
                message={
                  'The PID returned from GeoCoder does not match the one previously entered. Which PID value would you like to use?'
                }
              />
            )}
            <PidPinForm disabled={disabled || !allowEdit} />
            <InformationForm
              isAdmin={isAdmin ?? false}
              agencies={agencies}
              classifications={classifications}
              disabled={disabled || !allowEdit}
            />
          </Col>
          <Col md={6}>
            <AddressForm
              onGeocoderChange={handleGeocoderChanges}
              {...formikProps}
              disabled={disabled || !allowEdit}
              nameSpace="address"
            />
            <LatLongForm
              {...formikProps}
              disabled={disabled || !allowEdit}
              setMovingPinNameSpace={setMovingPinNameSpace}
            />
            <LandForm {...formikProps} disabled={disabled || !allowEdit} />
          </Col>
        </Row>
        <div className="scroll">
          <Row noGutters>
            <Col>
              <h4>Valuation Information</h4>
              <p>
                Total values for parcel inclusive of existing building(s) for the most recent year
                with data
              </p>
              <SumFinancialsForm formikProps={formikProps} showAppraisal={false} />
              <div key={disabled?.toString()}>
                <EvaluationForm
                  {...(formikProps as any)}
                  isParcel={true}
                  showAppraisal={false}
                  disabled={disabled || !allowEdit}
                  nameSpace="financials"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Tab>
      {(formikProps.values?.buildings?.length && formikProps.values?.buildings?.length > 0) ||
      !disabled ? (
        <Tab
          title="Buildings"
          eventKey={ParcelDetailTabs.buildings}
          tabClassName={
            Object.keys(formikProps.touched).length
              ? isTabInError(formikProps.errors, ParcelDetailTabs.buildings)
              : ''
          }
        >
          <PagedBuildingForms
            disabled={disabled}
            allowEdit={allowEdit}
            isAdmin={isAdmin}
            setMovingPinNameSpace={setMovingPinNameSpace}
          />
        </Tab>
      ) : null}
    </ErrorTabs>
  );
};

export default ParcelDetailForm;
