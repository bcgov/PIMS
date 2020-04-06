import { FunctionComponent, Fragment, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { Field, ErrorMessage, FieldArray, FormikProps } from 'formik';
import React from 'react';
import AddressForm, { defaultAddressValues } from './AddressForm';
import EvaluationForm, { defaultEvaluationValues } from './EvaluationForm';
import * as API from 'constants/API';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { FormikDatePicker } from 'components/common/FormikDatePicker';
import { Input, Form, Select } from 'components/common/form';
import { Check } from 'components/common/form/Check';
import { mapLookupCode } from 'utils';
import { FaTimes } from 'react-icons/fa';

export const defaultBuildingValues: API.IBuilding = {
  localId: '',
  description: '',
  address: defaultAddressValues,
  latitude: 0,
  longitude: 0,
  agencyId: 0,
  buildingConstructionTypeId: '',
  rentableArea: '',
  buildingFloorCount: '',
  buildingPredominateUseId: '',
  buildingOccupantTypeId: '',
  transferLeaseOnSale: false,
  occupantName: '',
  leaseExpiry: '',
  buildingTenancy: '',
  evaluations: [],
};
interface BuildingProps {
  nameSpace?: string;
  building?: any;
  index?: number;
}
const BuildingForm = <T extends any>(props: BuildingProps & FormikProps<T>) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const constructionType = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.CONSTRUCTION_CODE_SET_NAME;
  }).map(mapLookupCode);
  const predominateUses = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PREDOMINATE_USE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const occupantTypes = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.OCCUPANT_TYPE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const withNameSpace: Function = (name?: string) => {
    return [props.nameSpace, `${props.index}`, name].filter(x => x).join('.');
  };
  return (
    <Fragment>
      <h4>Building Information</h4>
      <Form.Row key={withNameSpace()} className="buildingForm">
        <AddressForm {...props} nameSpace={withNameSpace('address')} />
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Type of Construction
            </Form.Label>
            <Select
              placeholder="Must Select One"
              className="col-md-10"
              field={withNameSpace('buildingConstructionTypeId')}
              options={constructionType}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Rentable Area
            </Form.Label>
            <Input type="number" className="col-md-10" field={withNameSpace('rentableArea')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Number of Floors
            </Form.Label>
            <Input
              type="number"
              className="col-md-10"
              field={withNameSpace('buildingFloorCount')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Predominate Use
            </Form.Label>
            <Select
              placeholder="Must Select One"
              className="col-md-10"
              field={withNameSpace('buildingPredominateUseId')}
              options={predominateUses}
            />
          </Form.Row>
        </Col>
      </Form.Row>
      <h4>Tenancy</h4>
      <Form.Row className="buildingTenancy">
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Type of Current Occupant
            </Form.Label>
            <Select
              placeholder="Must Select One"
              className="col-md-10"
              field={withNameSpace('buildingOccupantTypeId')}
              options={occupantTypes}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Lease to be transferred with land
            </Form.Label>
            <Check className="col-md-10" field={withNameSpace('transferLeaseOnSale')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Date Lease Expires
            </Form.Label>
            <FormikDatePicker name={withNameSpace('leaseExpiry')} />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Tenancy
            </Form.Label>
            <Input className="col-md-10" field={withNameSpace('buildingTenancy')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Occupant Name
            </Form.Label>
            <Input className="col-md-10" field={withNameSpace('occupantName')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Sensitive Building
            </Form.Label>
            <Check className="col-md-10" field={withNameSpace('sensitiveBuilding')} />
          </Form.Row>
        </Col>
      </Form.Row>
      <Row>
        <Col>
          <h4>Building Valuation Information</h4>

          <FieldArray
            name={withNameSpace('evaluations')}
            render={arrayHelpers => (
              <div>
                <Button onClick={() => arrayHelpers.push(defaultEvaluationValues)}>
                  Add Land Valuation
                </Button>
                {props.building.evaluations.map((evaluation: any, evaluationIndex: number) => {
                  return (
                    <div key={evaluationIndex}>
                      <Button variant="danger" onClick={() => arrayHelpers.remove(evaluationIndex)}>
                        <FaTimes size={14} />
                      </Button>
                      <h5>Building Evaluation</h5>
                      <EvaluationForm
                        {...props}
                        nameSpace={withNameSpace('evaluations')}
                        evaluation={evaluation}
                        index={evaluationIndex}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default BuildingForm;
