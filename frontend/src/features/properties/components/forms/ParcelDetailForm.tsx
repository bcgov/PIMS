import React, { useState } from 'react';
import { Row, Col, Button, Tab, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, yupToFormErrors, FormikProps } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import InformationForm, { defaultInformationFormValues } from './subforms/InformationForm';
import { IFormBuilding } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import EvaluationForm, {
  defaultFinancials,
  filterEmptyFinancials,
  getMergedFinancials,
  IFinancial,
  IFinancialYear,
} from './subforms/EvaluationForm';
import './ParcelDetailForm.scss';
import { createParcel, updateParcel, deleteParcel } from 'actionCreators/parcelsActionCreator';
import { Form } from 'components/common/form';

import { IParcel, storeParcelDetail } from 'actions/parcelsActions';
import { clear } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { Persist } from 'components/common/FormikPersist';
import { LatLng } from 'leaflet';
import { FiscalKeys } from 'constants/fiscalKeys';
import SumFinancialsForm from './subforms/SumFinancialsForm';
import { PARCEL_STORAGE_NAME } from 'utils/storageUtils';
import PagedBuildingForms from './subforms/PagedBuildingForms';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { useApi, IGeocoderResponse } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import GenericModal from 'components/common/GenericModal';
import DebouncedValidation from './subforms/DebouncedValidation';
import styled from 'styled-components';
import { ErrorTabs, isTabInError } from 'features/projects/common';
import useCodeLookups from 'hooks/useLookupCodes';
import { ParcelDetailTabs } from 'features/mapSideBar/containers/ParcelDetailContainer';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import LatLongForm from './subforms/LatLongForm';
import { decimalOrUndefined } from 'utils';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { FaTrash } from 'react-icons/fa';
import LastUpdatedBy from '../LastUpdatedBy';

interface ParcelPropertyProps {
  parcelDetail: IParcel | null;
  secret: string;
  currentTab: ParcelDetailTabs;
  setCurrentTab: Function;
  setSidebarOpen: Function;
  formikRef: any;
  agencyId?: number;
  disabled?: boolean;
  clickLatLng?: LatLng;
  loadDraft?: boolean;
}

export interface IFormParcel extends IParcel {
  financials: IFinancialYear[];
  buildings: IFormBuilding[];
}

export const getInitialValues = (): any => {
  return {
    ...defaultPidPinFormValues,
    ...defaultLandValues,
    ...defaultInformationFormValues,
    latitude: '',
    longitude: '',
    address: defaultAddressValues,
    buildings: [],
    financials: defaultFinancials,
  };
};

const FormControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
`;

const showAppraisal = false;

const ParcelDetailForm = ({
  currentTab,
  setCurrentTab,
  setSidebarOpen,
  formikRef,
  ...props
}: ParcelPropertyProps) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const api = useApi();
  const [pidSelection, setPidSelection] = useState({ showPopup: false, geoPID: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  let initialValues = getInitialValues();
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const isAdmin = keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  let allowEdit =
    isAdmin || !props.parcelDetail || keycloak.hasAgency(props.parcelDetail?.agencyId as number);

  const { getOptionsByType } = useCodeLookups();

  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
  const agencyOptions = getOptionsByType(API.AGENCY_CODE_SET_NAME);

  initialValues.agencyId = keycloak.agencyId;
  //Load all data if we are updating a parcel.
  if (props?.parcelDetail?.id) {
    const buildings = props.parcelDetail?.buildings.map(building => {
      return {
        ...building,
        financials: getMergedFinancials([...building.evaluations, ...building.fiscals]),
      };
    });

    initialValues = {
      ...props.parcelDetail,
      pid: props.parcelDetail.pid ?? '',
      pin: props.parcelDetail.pin ?? '',
      projectNumber: props.parcelDetail.projectNumber ?? '',
      financials: getMergedFinancials([
        ...props.parcelDetail.evaluations,
        ...props.parcelDetail.fiscals,
      ]),
      buildings: buildings,
    };
  }
  const setLatLng = (formikProps: FormikProps<IFormParcel>) => {
    if (
      props.clickLatLng &&
      props.clickLatLng.lat !== formikProps.values.latitude &&
      props.clickLatLng.lng !== formikProps.values.longitude
    ) {
      formikProps.setFieldValue('latitude', props.clickLatLng.lat);
      formikProps.setFieldValue('longitude', props.clickLatLng.lng);
    }
  };
  //convert all form values to the format accepted by the API.
  const valuesToApiFormat = (values: IFormParcel): IFormParcel => {
    values.pin = values?.pin ? values.pin : undefined;
    values.pid = values?.pid ? values.pid : undefined;
    const seperatedFinancials = _.flatten(
      values.financials.map((financial: IFinancialYear) => _.values(financial)),
    ) as IFinancial[];
    const allFinancials = filterEmptyFinancials(seperatedFinancials);

    values.evaluations = _.filter(allFinancials, financial =>
      Object.keys(EvaluationKeys).includes(financial.key),
    );
    values.fiscals = _.filter(allFinancials, financial =>
      Object.keys(FiscalKeys).includes(financial.key),
    );
    values.financials = [];
    values.buildings.forEach(building => {
      building.agencyId = building?.agencyId ? building.agencyId : values.agencyId;

      if (!building.leaseExpiry || !building.leaseExpiry.length) {
        building.leaseExpiry = undefined;
      }
      const seperatedBuildingFinancials = _.flatten(
        building.financials.map((financial: IFinancialYear) => _.values(financial)),
      ) as IFinancial[];
      building.buildingFloorCount = decimalOrUndefined(
        building.buildingFloorCount?.toString() ?? '',
      );
      const allFinancials = filterEmptyFinancials(seperatedBuildingFinancials);
      building.evaluations = _.filter(allFinancials, financial =>
        Object.keys(EvaluationKeys).includes(financial.key),
      );
      building.fiscals = _.filter(allFinancials, financial =>
        Object.keys(FiscalKeys).includes(financial.key),
      );
      building.financials = [];
    });
    return values;
  };

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: IFormParcel) => {
    let financialErrors = {};

    const yupErrors: any = ParcelSchema.validate(values, { abortEarly: false }).then(
      () => {
        return financialErrors;
      },
      (err: any) => {
        return _.merge(yupToFormErrors(err), financialErrors);
      },
    );

    let pidDuplicated = false;
    if (values.pid && initialValues.pid !== values.pid) {
      pidDuplicated = !(await isPidAvailable(values));
    }

    let pinDuplicated = false;
    if (values.pin && initialValues.pin !== values.pin && values.pin.toString().length < 10) {
      pinDuplicated = !(await isPinAvailable(values));
    }

    let errors = await yupErrors;
    const { buildings: buildingErrors, tabs, ...parcelErrors } = errors;
    if (buildingErrors?.length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.buildings] };
    }
    if (parcelErrors && Object.keys(parcelErrors).length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.parcel] };
    }
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    if (pinDuplicated) {
      errors = { ...errors, pin: 'This PIN is already in use.' };
    }
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPinAvailable(values.id, values.pin);
    return response?.available;
  };

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

  const DeleteModal = ({
    showDeleteDialog,
    setShowDeleteDialog,
    dispatch,
    cachedParcelDetail,
  }: any) => (
    <GenericModal
      message="Are you sure you want to permanently delete the property?"
      cancelButtonText="Cancel"
      okButtonText="Delete"
      display={showDeleteDialog}
      handleOk={() => {
        dispatch(deleteParcel(cachedParcelDetail)).then(() => {
          dispatch(storeParcelDetail(null));
        });
        // todo: better error handling, currently this will log to global error handler.
      }}
      handleCancel={() => {
        setShowDeleteDialog(false);
      }}
    />
  );

  const DeleteButton = ({ cachedParcelDetail, keycloak, setShowDeleteDialog, disabled }: any) => {
    return (keycloak.hasAgency(cachedParcelDetail?.agencyId) ||
      keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) &&
      keycloak.hasClaim(Claims.PROPERTY_DELETE) &&
      cachedParcelDetail?.id ? (
      <Button
        className="delete-btn"
        onClick={(e: any) => {
          e.preventDefault();
          setShowDeleteDialog(true);
        }}
        disabled={disabled}
      >
        <TooltipWrapper toolTipId="delete-button-tooltip" toolTip="Delete Parcel">
          <FaTrash size={20} />
        </TooltipWrapper>
      </Button>
    ) : null;
  };

  return (
    <Row noGutters className="parcelDetailForm">
      <Col>
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
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validateOnChange={false}
          validate={handleValidate}
          enableReinitialize={true}
          onSubmit={async (values, actions) => {
            const apiValues = valuesToApiFormat(_.cloneDeep(values));
            try {
              if (!values.id) {
                const data = await createParcel(apiValues)(dispatch);
                dispatch(clear(actionTypes.ADD_PARCEL));
                dispatch(storeParcelDetail(data));
              } else {
                await updateParcel(apiValues)(dispatch);
              }
            } catch (error) {
              const msg: string =
                error?.response?.data?.error ?? 'Error saving property data, please try again.';
              actions.setStatus({ msg });
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {formikProps => (
            <Form>
              <FormControls className="form-controls">
                {formikProps.values.id && <LastUpdatedBy {...(formikProps.values as any)} />}

                <TooltipWrapper
                  toolTipId="submit-button-tooltip"
                  toolTip="Add Property to Inventory"
                >
                  {!props.disabled && (
                    <Button
                      disabled={props.disabled}
                      type="submit"
                      onClick={(e: any) => {
                        e.preventDefault();
                        formikProps.setSubmitting(true);
                        formikProps.submitForm();
                      }}
                    >
                      Submit&nbsp;
                      {formikProps.isSubmitting && (
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          as="span"
                          style={{ marginLeft: '.5rem' }}
                        />
                      )}
                    </Button>
                  )}
                </TooltipWrapper>
              </FormControls>

              <DeleteButton
                cachedParcelDetail={formikProps.values}
                keycloak={keycloak}
                setShowDeleteDialog={setShowDeleteDialog}
              />
              <DeleteModal
                {...{
                  showDeleteDialog,
                  setShowDeleteDialog,
                  dispatch,
                  cachedParcelDetail: formikProps.values,
                }}
              />
              <DebouncedValidation formikProps={formikProps} />
              {setLatLng(formikProps)}
              {!props.disabled && (
                <Persist
                  initialValues={initialValues}
                  secret={props.secret}
                  loadDraft={props.loadDraft}
                  name={PARCEL_STORAGE_NAME}
                  openSidebar={() => setSidebarOpen(true)}
                />
              )}
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
                      <PidPinForm disabled={props.disabled || !allowEdit} />
                      <InformationForm
                        isAdmin
                        agencies={agencyOptions}
                        classifications={classifications}
                        disabled={props.disabled || !allowEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <AddressForm
                        onGeocoderChange={handleGeocoderChanges}
                        {...formikProps}
                        disabled={props.disabled || !allowEdit}
                        nameSpace="address"
                      />
                      <LatLongForm {...formikProps} />
                      <LandForm {...formikProps} />
                    </Col>
                  </Row>
                  <Row noGutters>
                    <Col>
                      <h4>Valuation Information</h4>
                      <p>
                        Total values for parcel inclusive of existing building(s) for the most
                        recent year with data
                      </p>
                      <SumFinancialsForm formikProps={formikProps} showAppraisal={showAppraisal} />
                      <div key={props.disabled?.toString()}>
                        <EvaluationForm
                          {...(formikProps as any)}
                          isParcel={true}
                          showAppraisal={showAppraisal}
                          disabled={props.disabled || !allowEdit}
                          nameSpace="financials"
                        />
                      </div>
                    </Col>
                  </Row>
                </Tab>
                <Tab
                  title="Buildings"
                  eventKey={ParcelDetailTabs.buildings}
                  tabClassName={
                    Object.keys(formikProps.touched).length
                      ? isTabInError(formikProps.errors, ParcelDetailTabs.buildings)
                      : ''
                  }
                >
                  <PagedBuildingForms disabled={props.disabled} allowEdit={allowEdit} />
                  {formikProps.status && formikProps.status.msg && (
                    <p style={{ color: 'red' }}>{formikProps.status.msg}</p>
                  )}
                </Tab>
              </ErrorTabs>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default ParcelDetailForm;
