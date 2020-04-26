import { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import React from 'react';
import AddressForm, { defaultAddressValues } from './AddressForm';
import EvaluationForm, { defaultFinancials } from './EvaluationForm';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { Form, FastDatePicker, FastSelect, InputGroup } from 'components/common/form';
import { Check } from 'components/common/form/Check';
import { mapLookupCode, formikFieldMemo } from 'utils';
import * as API from 'constants/API';
import { FastInput } from 'components/common/form/FastInput';
import { IBuilding } from 'actions/parcelsActions';

export interface IFormBuilding extends IBuilding {
  financials: any;
}

export const defaultBuildingValues: any = {
  id: 0,
  localId: '',
  projectNumber: '',
  description: '',
  address: defaultAddressValues,
  latitude: 0,
  longitude: 0,
  agencyId: 0,
  rentableArea: '',
  buildingFloorCount: '',
  buildingConstructionType: undefined,
  buildingConstructionTypeId: '',
  buildingPredominateUse: undefined,
  buildingPredominateUseId: '',
  buildingOccupantType: undefined,
  buildingOccupantTypeId: '',
  transferLeaseOnSale: false,
  occupantName: '',
  leaseExpiry: '',
  buildingTenancy: '',
  evaluations: [],
  fiscals: [],
  financials: defaultFinancials,
};
interface BuildingProps {
  nameSpace?: string;
  index?: number;
  disabled?: boolean;
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
            <FastSelect
              formikProps={props}
              disabled={props.disabled}
              placeholder="Must Select One"
              outerClassName="col-md-10"
              field={withNameSpace('buildingConstructionTypeId')}
              options={constructionType}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Rentable Area
            </Form.Label>
            <InputGroup
              fast={true}
              formikProps={props}
              disabled={props.disabled}
              type="number"
              outerClassName="col-md-7"
              field={withNameSpace('rentableArea')}
              postText="Sq. Ft"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Number of Floors
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              type="number"
              outerClassName="col-md-10"
              field={withNameSpace('buildingFloorCount')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Predominate Use
            </Form.Label>
            <FastSelect
              formikProps={props}
              disabled={props.disabled}
              placeholder="Must Select One"
              outerClassName="col-md-10"
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
            <FastSelect
              formikProps={props}
              disabled={props.disabled}
              placeholder="Must Select One"
              outerClassName="col-md-10"
              field={withNameSpace('buildingOccupantTypeId')}
              options={occupantTypes}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Lease to be transferred with land
            </Form.Label>
            <Check
              disabled={props.disabled}
              className="col-md-10"
              field={withNameSpace('transferLeaseOnSale')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Date Lease Expires
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-10"
              formikProps={props}
              disabled={props.disabled}
              field={withNameSpace('leaseExpiry')}
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Tenancy
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              field={withNameSpace('buildingTenancy')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Occupant Name
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              field={withNameSpace('occupantName')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Sensitive Building
            </Form.Label>
            <Check
              disabled={props.disabled}
              className="col-md-10"
              field={withNameSpace('sensitiveBuilding')}
            />
          </Form.Row>
        </Col>
      </Form.Row>
      <Row noGutters>
        <Col>
          <h4>Building Valuation Information</h4>
          <EvaluationForm {...props} nameSpace={withNameSpace('financials')} />
        </Col>
      </Row>
    </Fragment>
  );
};

export default React.memo(BuildingForm, (prevProps, currentProps) => {
  const prev = { formikProps: prevProps, field: prevProps.nameSpace };
  const curr = { formikProps: currentProps, field: currentProps.nameSpace };
  return formikFieldMemo(prev, curr) && prevProps.disabled !== currentProps.disabled;
});
