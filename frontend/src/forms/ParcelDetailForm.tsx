import React, { FunctionComponent, Fragment, useState, useEffect } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import _ from 'lodash';
import { ParcelSchema } from 'utils/YupSchema';
import PidPinForm, { defaultPidPinFormValues } from './subforms/PidPinForm';
import BuildingForm, { defaultBuildingValues } from './subforms/BuildingForm';
import AddressForm, { defaultAddressValues } from './subforms/AddressForm';
import LandForm, { defaultLandValues } from './subforms/LandForm';
import EvaluationForm, { defaultEvaluationValues } from './subforms/EvaluationForm';
import './ParcelDetailForm.scss';
import { useHistory } from 'react-router-dom';
import * as API from 'constants/API';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { createParcel } from 'actionCreators/parcelsActionCreator';
import { Form } from 'components/common/form';
import { FaTimes } from 'react-icons/fa';
import { decimalOrNull, decimalOrEmpty } from 'utils';
import { RootState } from 'reducers/rootReducer';
import { IGenericNetworkAction, error } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import * as ReducerTypes from 'constants/reducerTypes';

const ParcelDetailForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  if (!keycloak.agency) {
    //TODO: implement an error boundary and throw an exception here.
    history.push('/mapView');
  }
  const initialValues: API.IParcel = {
    ...defaultLandValues,
    ...defaultPidPinFormValues,
    agencyId: parseInt(keycloak.agency ?? '0'),
    address: defaultAddressValues,
    buildings: [],
    evaluations: [],
  };
  const valuesToApiFormat = (values: API.IParcel) => {
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
  const addParcelRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.ADD_PARCEL] as IGenericNetworkAction,
  );
  useEffect(() => {
    if (addParcelRequest?.status === 201) {
      history.push('/mapview');
    }
  }, [addParcelRequest]);

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
            onSubmit={(values, { setSubmitting }) => {
              dispatch(createParcel(values));
              setSubmitting(false);
            }}
          >
            {props => (
              <Form>
                <Row noGutters>
                  <Col>
                    <h3>Address</h3>
                    <Form.Row className="pidPinForm">
                      <PidPinForm />
                      <AddressForm {...props} nameSpace="address" />
                    </Form.Row>
                  </Col>
                </Row>
                <Row noGutters>
                  <Col>
                    <h3>Land</h3>
                    <LandForm {...props}></LandForm>
                    <h4>Valuation Information</h4>
                    <FieldArray
                      name="evaluations"
                      render={arrayHelpers => (
                        <div>
                          <Button onClick={() => arrayHelpers.push(defaultEvaluationValues)}>
                            Add Land Valuation
                          </Button>

                          {props.values.evaluations.map((evaluation, index) => {
                            return (
                              <div key={index}>
                                <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                                  <FaTimes size={14} />
                                </Button>
                                <h5>Evaluation</h5>
                                <EvaluationForm
                                  {...props}
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
                          <Button onClick={() => arrayHelpers.push(defaultBuildingValues)}>
                            Add Building
                          </Button>
                          {props.values.buildings.map((building, index) => {
                            return (
                              <div key={index}>
                                <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                                  <FaTimes size={14} />
                                </Button>
                                <h5>Building</h5>
                                <BuildingForm
                                  {...props}
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
                  <Button
                    type="submit"
                    onClick={() => {
                      valuesToApiFormat(props.values);
                      props.setSubmitting(false);
                    }}
                  >
                    Submit
                  </Button>
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
