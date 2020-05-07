import React from 'react';
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
import { Form } from 'components/common/form';

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

const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let initialValues = getInitialValues();
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
    values.statusId = values.statusId ? 1 : 0;
    const allFinancials = filterEmptyFinancials(values.financials);

    values.evaluations = _.filter(allFinancials, financial =>
      Object.keys(EvaluationKeys).includes(financial.key),
    );
    values.fiscals = _.filter(allFinancials, financial =>
      Object.keys(FiscalKeys).includes(financial.key),
    );
    values.financials = [];
    values.buildings.forEach(building => {
      building.agencyId = building.agencyId = values.agencyId;

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
  const handleValidate = (values: IFormParcel) => {
    let financialErrors = validateFinancials(values.financials, 'financials');
    values.buildings.forEach((building, index) => {
      financialErrors = {
        ...financialErrors,
        ...validateFinancials(building.financials, `buildings.${index}.financials`),
      };
    });
    const yupErrors: any = validateYupSchema(values, ParcelSchema).then(
      () => {
        return financialErrors;
      },
      (err: any) => {
        return _.merge(yupToFormErrors(err), financialErrors);
      },
    );
    return Promise.resolve(yupErrors);
  };

  return (
    <Row noGutters className="parcelDetailForm">
      <Col>
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validate={handleValidate}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            let response: any;
            const apiValues = valuesToApiFormat(_.cloneDeep(values));

            if (!values.id) {
              response = dispatch(createParcel(apiValues));
            } else {
              response = dispatch(updateParcel(apiValues));
            }
            response
              .then(() => {
                history.push('/');
              })
              .catch((error: any) => {
                actions.setStatus({ msg: error.toString() });
              })
              .finally(() => {
                actions.setSubmitting(false);
                dispatch(clear(actionTypes.ADD_PARCEL));
                dispatch(clear(actionTypes.UPDATE_PARCEL));
              });
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
                    <PidPinForm disabled={props.disabled} />
                    <AddressForm {...formikProps} disabled={props.disabled} nameSpace="address" />
                  </Form.Row>
                </Col>
              </Row>
              <Row noGutters>
                <Col>
                  {<LandForm {...formikProps} disabled={props.disabled}></LandForm>}
                  <h4>Total values for parcel inclusive of existing building(s)</h4>
                  <Form.Row className="sumFinancialsForm">
                    <SumFinancialsForm {...formikProps} />
                  </Form.Row>
                  <h4>Valuation Information</h4>
                  <EvaluationForm
                    {...formikProps}
                    disabled={props.disabled}
                    nameSpace="financials"
                  />
                </Col>
              </Row>
              <Row noGutters>
                <PagedBuildingForms disabled={props.disabled} />
              </Row>
              <div style={{ textAlign: 'right' }}>
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
