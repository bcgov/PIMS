import React, { useMemo } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, validateYupSchema, yupToFormErrors, FormikProps } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import { IFormBuilding } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import EvaluationForm, {
  defaultFinancials,
  filterEmptyFinancials,
  getMergedFinancials,
  validateFinancials,
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
  financials: any;
  buildings: IFormBuilding[];
}

const showAppraisal = false;

const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const history = useHistory();
  const api = useApi();
  const formikRef = React.useRef<FormikProps<any>>();
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
    const allFinancials = filterEmptyFinancials(values.financials);

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
      const allFinancials = filterEmptyFinancials(building.financials);
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

    if (values.pid) {
      financialErrors = validateFinancials(values.financials, 'financials', showAppraisal);
      values.buildings.forEach((building, index) => {
        financialErrors = {
          ...financialErrors,
          ...validateFinancials(
            building.financials,
            `buildings.${index}.financials`,
            showAppraisal,
          ),
        };
      });
    }

    const yupErrors: any = validateYupSchema(values, ParcelSchema).then(
      () => {
        return financialErrors;
      },
      (err: any) => {
        return _.merge(yupToFormErrors(err), financialErrors);
      },
    );

    let pidDuplicated = false;
    if (values.pid) {
      pidDuplicated = !(await isPidAvailable(values));
    }

    let errors = await yupErrors;
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const { available } = await api.isPidAvailable(values.id, values.pid);
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
      newValues.pid = parcelPid;

      // update form with values returned from geocoder
      formikRef.current.setValues(newValues);
    }
  };

  return (
    <Row noGutters className="parcelDetailForm">
      <Col>
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
              const msg: string = error?.response?.data?.error ?? error.toString();
              actions.setStatus({ msg });
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {formikProps => (
            <Form>
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
                {!props.disabled && (
                  <Button disabled={props.disabled} type="submit">
                    Submit&nbsp;
                    {formikProps.isSubmitting && (
                      <Spinner animation="border" size="sm" role="status" as="span" />
                    )}
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default ParcelDetailForm;
