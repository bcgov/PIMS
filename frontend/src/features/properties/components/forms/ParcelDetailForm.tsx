import React, { useMemo, useState } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, yupToFormErrors, FormikProps } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import { IFormBuilding } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import EvaluationForm, {
  defaultFinancials,
  filterEmptyFinancials,
  getMergedFinancials,
  IFinancial,
  IFinancialYear,
} from './subforms/EvaluationForm';
import './ParcelDetailForm.scss';
import { useHistory } from 'react-router-dom';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { Form, TextArea } from 'components/common/form';

import { IParcel } from 'actions/parcelsActions';
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
import LastUpdatedBy from '../LastUpdatedBy';
import ManualLink from 'features/projects/common/components/ManualLink';

interface ParcelPropertyProps {
  parcelDetail: IParcel | null;
  secret: string;
  agencyId?: number;
  disabled?: boolean;
  clickLatLng?: LatLng;
  loadDraft?: boolean;
}

export const getInitialValues = (): any => {
  return {
    ...defaultLandValues,
    ...defaultPidPinFormValues,
    address: defaultAddressValues,
    buildings: [],
    financials: defaultFinancials,
  };
};
export interface IFormParcel extends IParcel {
  financials: IFinancialYear[];
  buildings: IFormBuilding[];
}

const FormControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
`;

const showAppraisal = false;

const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const history = useHistory();
  const api = useApi();
  const formikRef = React.useRef<FormikProps<any>>();
  const [pidSelection, setPidSelection] = useState({ showPopup: false, geoPID: '' });
  let initialValues = getInitialValues();
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );

  let allowEdit =
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES) ||
    !props.parcelDetail ||
    keycloak.hasAgency(props.parcelDetail?.agencyId as number);

  const agencies = useMemo(
    () =>
      _.filter(lookupCodes, (lookupCode: ILookupCode) => {
        return lookupCode.type === API.AGENCY_CODE_SET_NAME;
      }),
    [lookupCodes],
  );

  agencies.forEach(x => {
    if (x.id.toString() === props.agencyId?.toString()) {
      initialValues.agency = x.code;
    }
  });

  initialValues.agencyId = props.agencyId;
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
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    if (pinDuplicated) {
      errors = { ...errors, pin: 'This PIN is already in use.' };
    }
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const { available } = await api.isPidAvailable(values.id, values.pid);
    return available;
  };

  const isPinAvailable = async (values: IFormParcel): Promise<boolean> => {
    const { available } = await api.isPinAvailable(values.id, values.pin);
    return available;
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

      const city = data.city
        ? lookupCodes.find(code => {
            return code.type === API.CITY_CODE_SET_NAME && code.name === data.city;
          })
        : undefined;

      if (city) {
        newValues.address.cityId = city.id;
        newValues.address.city = city.name;
      } else {
        newValues.address.cityId = '';
        newValues.address.city = '';
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
    <Row noGutters className="parcelDetailForm">
      <Col>
        {pidSelection.showPopup && (
          <GenericModal
            cancelButtonText={`Use original PID ${formikRef.current?.values.pid}`}
            okButtonText={`Use GeoCoder PID ${pidSelection.geoPID}`}
            handleOk={(e: any) => {
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
          innerRef={instance => {
            formikRef.current = instance;
          }}
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
                history.replace(`/submitProperty/${data.id}`);
              } else {
                await updateParcel(apiValues)(dispatch);
                history.go(0);
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
              <DebouncedValidation formikProps={formikProps} />
              {setLatLng(formikProps)}
              {!props.disabled && (
                <Persist
                  initialValues={initialValues}
                  secret={props.secret}
                  loadDraft={props.loadDraft}
                  name={PARCEL_STORAGE_NAME}
                />
              )}
              <Row noGutters>
                <Col>
                  <h3>Parcel Information</h3>
                  <Form.Row className="pidPinForm">
                    <PidPinForm disabled={props.disabled || !allowEdit} />
                    <Col md={6}>
                      <AddressForm
                        onGeocoderChange={handleGeocoderChanges}
                        {...formikProps}
                        disabled={props.disabled || !allowEdit}
                        nameSpace="address"
                      />
                      <Form.Row>
                        <Form.Label column md={2}>
                          Description
                        </Form.Label>
                        <TextArea
                          disabled={props.disabled || !allowEdit}
                          outerClassName="col-md-10"
                          field="description"
                        />
                      </Form.Row>
                    </Col>
                  </Form.Row>
                </Col>
              </Row>
              <Row noGutters>
                <Col>
                  <LandForm {...formikProps} disabled={props.disabled || !allowEdit}></LandForm>
                  <h4>Total values for parcel inclusive of existing building(s)</h4>
                  <Form.Row className="sumFinancialsForm">
                    <SumFinancialsForm formikProps={formikProps} showAppraisal={showAppraisal} />
                  </Form.Row>
                  <h4>Valuation Information</h4>
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
              <Row noGutters key={props.disabled?.toString()}>
                <PagedBuildingForms disabled={props.disabled} allowEdit={allowEdit} />
              </Row>
              <div
                style={{
                  textAlign: 'right',
                  position: 'sticky',
                  bottom: '-18px',
                  backgroundColor: '#f2f2f2',
                  zIndex: 4,
                }}
              >
                {formikProps.status && formikProps.status.msg && (
                  <p style={{ color: 'red' }}>{formikProps.status.msg}</p>
                )}
                <ManualLink
                  url="https://www2.gov.bc.ca/gov/content/governments/services-for-government/real-estate-space/asset-management-services/inventory-policy "
                  label="Inventory Policy"
                />
                <FormControls>
                  {formikProps.values.id && <LastUpdatedBy {...(formikProps.values as any)} />}
                  {!props.disabled && (
                    <Button disabled={props.disabled} type="submit">
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
                </FormControls>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default ParcelDetailForm;
