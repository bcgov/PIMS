import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray, FormikErrors, validateYupSchema, yupToFormErrors } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import BuildingForm, { defaultBuildingValues, IFormBuilding } from './subforms/BuildingForm';
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
import { FaTimes } from 'react-icons/fa';
import { decimalOrEmpty } from 'utils';

import { IParcel } from 'actions/parcelsActions';
import { clear } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { Persist } from 'components/common/FormikPersist';
import { LatLng } from 'leaflet';
import { FiscalKeys } from 'constants/fiscalKeys';
import SumFinancialsForm from './subforms/SumFinancialsForm';

interface ParcelPropertyProps {
  parcelDetail: IParcel | null;
  secret: string;
  agencyId?: number;
  disabled?: boolean;
  clickLatLng?: LatLng;
}

export interface IFormParcel extends IParcel {
  financials: any;
  buildings: IFormBuilding[];
}

const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const getInitialValues = (): any => {
    return {
      ...defaultLandValues,
      ...defaultPidPinFormValues,
      agencyId: props.agencyId,
      address: defaultAddressValues,
      buildings: [],
      financials: defaultFinancials,
    };
  };
  let initialValues = getInitialValues();
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
  const setLatLng = (values: IParcel) => {
    if (props.clickLatLng) {
      values.latitude = props.clickLatLng.lat;
      values.longitude = props.clickLatLng.lng;
    }
  };
  //convert all form values to the format accepted by the API.
  const valuesToApiFormat = (values: IFormParcel): IFormParcel => {
    values.pin = decimalOrEmpty(values.pin);
    values.pid = values?.pid?.length ? values.pid : undefined;
    values.statusId = values.statusId ? 1 : 0;
    values.classificationId = decimalOrEmpty(values.classificationId);
    values.address.cityId = decimalOrEmpty(values.address.cityId);
    const allFinancials = filterEmptyFinancials(values.financials);
    values.evaluations = _.filter(allFinancials, financial =>
      Object.keys(EvaluationKeys).includes(financial.key),
    );
    values.fiscals = _.filter(allFinancials, financial =>
      Object.keys(FiscalKeys).includes(financial.key),
    );
    values.financials = [];
    values.buildings.forEach(building => {
      //default latitude, longitude, agency to the parcel value if none provided.
      building.latitude = building.latitude ? building.latitude : values.latitude;
      building.longitude = building.longitude ? building.latitude : values.longitude;
      building.agencyId = building.agencyId = values.agencyId;

      if (!building.leaseExpiry || !building.leaseExpiry.length) {
        building.leaseExpiry = undefined;
      }
      if (building.address) {
        building.address.cityId = decimalOrEmpty(building.address.cityId);
      }
      building.buildingOccupantTypeId = decimalOrEmpty(building.buildingOccupantTypeId);
      building.buildingPredominateUseId = decimalOrEmpty(building.buildingPredominateUseId);
      building.buildingConstructionTypeId = decimalOrEmpty(building.buildingConstructionTypeId);
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

    const yupErrors = validateYupSchema(values, ParcelSchema).then(
      () => { },
      (err: any) => {
        return { ...yupToFormErrors(err), ...financialErrors };
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
          onSubmit={values => {
            let response: any;
            const apiValues = valuesToApiFormat(_.cloneDeep(values));

            if (!values.id) {
              response = dispatch(createParcel(apiValues));
            } else {
              response = dispatch(updateParcel(apiValues));
            }
            response
              .then(() => {
                history.goBack();
              })
              .catch((error: FormikErrors<IParcel>) => {
                //swallow, allow global error handling.
                //TODO: display errors on specific fields based on the error.
              })
              .finally(() => {
                dispatch(clear(actionTypes.ADD_PARCEL));
                dispatch(clear(actionTypes.UPDATE_PARCEL));
              });
          }}
        >
          {formikProps => (
            <Form>
              {setLatLng(formikProps.values)}
              {!props.disabled && (
                <Persist
                  writeOnly={props.parcelDetail?.id}
                  initialValues={initialValues}
                  secret={props.secret}
                  name="parcelDetailForm"
                />
              )}
              <Row noGutters>
                <Col>
                  <h3>Address</h3>
                  <Form.Row className="pidPinForm">
                    <PidPinForm disabled={props.disabled} />
                    <AddressForm {...formikProps} disabled={props.disabled} nameSpace="address" />
                  </Form.Row>
                  <Form.Row className="sumFinancialsForm">
                    <SumFinancialsForm {...formikProps} />
                  </Form.Row>
                </Col>
              </Row>
              <Row noGutters>
                <Col>
                  <h3>Land</h3>
                  {<LandForm {...formikProps} disabled={props.disabled}></LandForm>}
                  <h4>Valuation Information</h4>
                  <EvaluationForm
                    {...formikProps}
                    disabled={props.disabled}
                    nameSpace="financials"
                  />
                </Col>
              </Row>
              <Row noGutters>
                <Col>
                  <h3>Buildings</h3>
                  <FieldArray
                    name="buildings"
                    render={arrayHelpers => (
                      <div>
                        {!props.disabled && (
                          <Button
                            className="addBuilding"
                            disabled={props.disabled}
                            onClick={() => arrayHelpers.push(defaultBuildingValues)}
                          >
                            Add Building
                          </Button>
                        )}
                        {formikProps.values.buildings.map((building, index) => {
                          return (
                            <div key={index}>
                              {!props.disabled && (
                                <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                                  <FaTimes size={14} />
                                </Button>
                              )}
                              <h5>Building</h5>
                              <BuildingForm
                                {...formikProps}
                                disabled={props.disabled}
                                nameSpace="buildings"
                                index={index}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </Col>
              </Row>
              <div style={{ textAlign: 'right' }}>
                {!props.disabled && (
                  <Button disabled={props.disabled} type="submit">
                    Submit
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
