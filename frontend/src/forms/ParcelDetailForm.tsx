import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import BuildingForm, { defaultBuildingValues } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import EvaluationForm, { defaultEvaluationValues } from './subforms/EvaluationForm';
import './ParcelDetailForm.scss';
import { useHistory } from 'react-router-dom';
import { createParcel, fetchParcelDetail, updateParcel } from 'actionCreators/parcelsActionCreator';
import { Form } from 'components/common/form';
import { FaTimes } from 'react-icons/fa';
import { decimalOrEmpty } from 'utils';
import { RootState } from 'reducers/rootReducer';
import { Persist } from 'components/common/FormikPersist';

import { IParcel, IPropertyDetail } from 'actions/parcelsActions';
import { clear } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';

interface ParcelPropertyProps {
  parcelId: number;
  secret: string;
  agencyId?: number;
  disabled?: boolean;
  updateLatLng: Function;
}
const ParcelDetailForm = (props: ParcelPropertyProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let initialValues: IParcel = {
    ...defaultLandValues,
    ...defaultPidPinFormValues,
    agencyId: props.agencyId,
    address: defaultAddressValues,
    buildings: [],
    evaluations: [],
  };
  const activeParcelDetail = useSelector<RootState, IPropertyDetail>(
    state => state.parcel.parcelDetail as IPropertyDetail,
  );
  const valuesToApiFormat = (values: IParcel) => {
    values.statusId = values.statusId ? 1 : 0;
    values.classificationId = decimalOrEmpty(values.classificationId as string);
    values.address.cityId = decimalOrEmpty(values.address.cityId as string);

    values.buildings.forEach(building => {
      building.latitude = building.latitude ? building.latitude : values.latitude;
      building.longitude = building.longitude ? building.latitude : values.longitude;
      building.agencyId = building.agencyId = values.agencyId;
      if (!building.leaseExpiry || !building.leaseExpiry.length) {
        building.leaseExpiry = undefined;
      }
      if (building.address) {
        building.address.cityId = decimalOrEmpty(building.address.cityId as string);
      }
      building.buildingOccupantTypeId = decimalOrEmpty(building.buildingOccupantTypeId as string);
      building.buildingPredominateUseId = decimalOrEmpty(
        building.buildingPredominateUseId as string,
      );
      building.buildingConstructionTypeId = decimalOrEmpty(
        building.buildingConstructionTypeId as string,
      );
    });
  };

  //Load all data if we are updating a parcel.
  if (activeParcelDetail?.parcelDetail?.id) {
    initialValues = { ...(activeParcelDetail.parcelDetail as IParcel) };
  } else if (props.parcelId) {
    //we were passed a detail id but we have no data cached - just reload.
    dispatch(fetchParcelDetail({ id: props.parcelId }));
  }

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
            enableReinitialize
            onSubmit={(values, { setSubmitting, resetForm, setStatus, setErrors }) => {
              let response: any;
              if (!values.id) {
                response = dispatch(createParcel(values));
              } else {
                response = dispatch(updateParcel(values));
              }
              response
                .then(() => {
                  dispatch(clear(actionTypes.ADD_PARCEL));
                  dispatch(clear(actionTypes.UPDATE_PARCEL));
                  resetForm();
                  history.goBack();
                })
                .error((error: FormikErrors<IParcel>) => {
                  //swallow, allow global error handling.
                  //TODO: display errors on specific fields based on the error.
                });

              setSubmitting(false);
            }}
          >
            {formikProps => (
              <Form>
                <Persist
                  writeOnly={!!props.parcelId}
                  initialValues={initialValues}
                  secret={props.secret}
                  name="parcelDetailForm"
                />
                {props.updateLatLng(formikProps.values)}
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
                    <FieldArray
                      name="evaluations"
                      render={arrayHelpers => (
                        <div>
                          {!props.disabled && (
                            <Button
                              className="addEval"
                              onClick={() => arrayHelpers.push(defaultEvaluationValues)}
                            >
                              Add Land Valuation
                            </Button>
                          )}

                          {formikProps.values.evaluations.map((evaluation, index) => {
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
                                <h5>Evaluation</h5>
                                <EvaluationForm
                                  {...formikProps}
                                  disabled={props.disabled}
                                  nameSpace="evaluations"
                                  key={index}
                                  evaluation={evaluation}
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
                    <Button
                      disabled={props.disabled}
                      type="submit"
                      onClick={() => {
                        valuesToApiFormat(formikProps.values);
                        formikProps.setSubmitting(false);
                      }}
                    >
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

export default ParcelDetailForm;
