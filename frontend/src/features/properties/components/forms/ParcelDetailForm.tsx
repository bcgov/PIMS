import * as React from 'react';
import { Row, Col, Tab } from 'react-bootstrap';
import PidPinForm from './subforms/PidPinForm';
import InformationForm from './subforms/InformationForm';
import AddressForm from './subforms/AddressForm';
import LatLongForm from './subforms/LatLongForm';
import SumFinancialsForm from './subforms/SumFinancialsForm';
import EvaluationForm from './subforms/EvaluationForm';
import { useFormikContext } from 'formik';
import { IGeocoderResponse } from 'hooks/useApi';
import useCodeLookups from 'hooks/useLookupCodes';
import { ParcelDetailTabs } from 'features/properties/containers/ParcelDetailContainer';

import PagedBuildingForms from './subforms/PagedBuildingForms';
import { IParcel } from 'actions/parcelsActions';
import GenericModal from 'components/common/GenericModal';
import './ParcelDetailForm.scss';
import { isTabInError } from 'components/common/tabValidation';
import LandForm from './subforms/LandForm';
import ErrorTabs from 'components/common/ErrorTabs';
import * as API from 'constants/API';
import { IPidSelection } from 'features/properties/hooks/useGeocoder';

interface IParcelDetailFormProps {
  disabled: boolean;
  allowEdit: boolean;
  formikRef: any;
  pidSelection: IPidSelection;
  setPidSelection: (selection: IPidSelection) => void;
  currentTab: ParcelDetailTabs;
  setCurrentTab: (tab: ParcelDetailTabs) => void;
  setMovingPinNameSpace: (nameSpace: string) => void;
  handleGeocoderChanges: (data: IGeocoderResponse) => Promise<void>;
  handlePidChange: (pid: string) => void;
  handlePinChange: (pin: string) => void;
  isAdmin?: boolean;
}

const ParcelDetailForm: React.FunctionComponent<IParcelDetailFormProps> = ({
  disabled,
  allowEdit,
  formikRef,
  pidSelection,
  setPidSelection,
  currentTab,
  setCurrentTab,
  setMovingPinNameSpace,
  handleGeocoderChanges,
  handlePidChange,
  handlePinChange,
  isAdmin,
}) => {
  const formikProps = useFormikContext<IParcel>();
  const { getOptionsByType } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);

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
            <PidPinForm
              disabled={disabled || !allowEdit}
              handlePidChange={handlePidChange}
              handlePinChange={handlePinChange}
            />
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
