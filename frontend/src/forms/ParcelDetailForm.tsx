import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import BuildingForm, { defaultBuildingValues } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import EvaluationForm, {
  defaultEvaluations,
  getMergedEvaluations,
} from './subforms/EvaluationForm';
import './ParcelDetailForm.scss';
import { useHistory } from 'react-router-dom';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { Form } from 'components/common/form';
import { FaTimes } from 'react-icons/fa';
import { decimalOrEmpty } from 'utils';

import { IParcel, IEvaluation } from 'actions/parcelsActions';
import { clear } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { Persist } from 'components/common/FormikPersist';
import { LatLng } from 'leaflet';

interface ParcelPropertyProps {
  parcelDetail: IParcel | null;
  secret: string;
  agencyId?: number;
  disabled?: boolean;
  clickLatLng?: LatLng;
}
const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const getInitialValues = (): IParcel => {
    return {
      ...defaultLandValues,
      ...defaultPidPinFormValues,
      agencyId: props.agencyId,
      address: defaultAddressValues,
      buildings: [],
      evaluations: defaultEvaluations,
    };
  };
  let initialValues = getInitialValues();
  //Load all data if we are updating a parcel.
  if (props?.parcelDetail?.id) {
    props.parcelDetail.buildings.forEach(building => {
      building.evaluations = getMergedEvaluations(building.evaluations);
    });
    initialValues = {
      ...props.parcelDetail,
      pid: props.parcelDetail.pid ?? '',
      pin: props.parcelDetail.pin ?? '',
      evaluations: getMergedEvaluations(props.parcelDetail.evaluations),
    };
  }

  const filterEmptyEvaluations = (evaluations: IEvaluation[]) =>
    _.filter(
      evaluations,
      evaluation =>
        !!evaluation.value || (evaluation.key === EvaluationKeys.Appraised && !!evaluation.date),
    );
  const setLatLng = (values: IParcel) => {
    if (props.clickLatLng) {
      values.latitude = props.clickLatLng.lat;
      values.longitude = props.clickLatLng.lng;
    }
  };
  const valuesToApiFormat = (values: IParcel): IParcel => {
    values.pin = decimalOrEmpty(values.pin);
    values.pid = values?.pid?.length ? values.pid : undefined;
    values.statusId = values.statusId ? 1 : 0;
    values.classificationId = decimalOrEmpty(values.classificationId);
    values.address.cityId = decimalOrEmpty(values.address.cityId);
    values.evaluations = filterEmptyEvaluations(values.evaluations);
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
      building.evaluations = filterEmptyEvaluations(building.evaluations);
    });
    return values;
  };
  return (
    <Container fluid={true} className="parcelDetailForm">
      <Row>
        <Col>
          <h2>Submit a Property</h2>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <Button variant="light" onClick={() => history.goBack()}>
            Back to Previous
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={ParcelSchema}
            onSubmit={(values, { resetForm }) => {
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
                .error((error: FormikErrors<IParcel>) => {
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
                  </Col>
                </Row>
                <Row noGutters>
                  <Col>
                    <h3>Land</h3>
                    <LandForm {...formikProps} disabled={props.disabled}></LandForm>
                    <h4>Valuation Information</h4>
                    <EvaluationForm
                      {...formikProps}
                      disabled={props.disabled}
                      nameSpace="evaluations"
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
                                  <Button
                                    variant="danger"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    <FaTimes size={14} />
                                  </Button>
                                )}
                                <h5>Building</h5>
                                <BuildingForm
                                  {...formikProps}
                                  disabled={props.disabled}
                                  nameSpace="buildings"
                                  building={building}
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
    </Container>
  );
};

export default React.memo(ParcelDetailForm, props => !!props.parcelDetail);
