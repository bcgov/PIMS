import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import * as API from 'constants/API';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { Form, FastSelect, InputGroup } from 'components/common/form';
import { mapLookupCode } from 'utils';
import { Check } from 'components/common/form/Check';
import { IParcel } from 'actions/parcelsActions';
import { FastInput } from 'components/common/form/FastInput';

interface LandProps {
  nameSpace?: string;
  disabled?: boolean;
}

export const defaultLandValues: IParcel = {
  id: undefined,
  pid: '',
  projectNumber: '',
  agency: undefined,
  agencyId: '',
  address: null,
  description: '',
  landLegalDescription: '',
  pin: '',
  zoning: '',
  zoningPotential: '',
  municipality: '',
  landArea: '',
  statusId: 1,
  propertyStatus: undefined,
  classification: undefined,
  classificationId: '',
  isSensitive: false,
  latitude: '',
  longitude: '',
  evaluations: [],
  buildings: [],
  fiscals: [],
};
const LandForm = <T extends any>(props: LandProps & FormikProps<T>) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const classifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME;
  }).map(mapLookupCode);
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <Fragment>
      <Form.Row className="landForm">
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Municipality
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              field={withNameSpace('municipality')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Zoning
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              field={withNameSpace('zoning')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Zoning Potential
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              field={withNameSpace('zoningPotential')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Latitude
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              type="number"
              outerClassName="col-md-10"
              field={withNameSpace('latitude')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Longitude
            </Form.Label>
            <FastInput
              formikProps={props}
              disabled={props.disabled}
              type="number"
              outerClassName="col-md-10"
              field={withNameSpace('longitude')}
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Active
            </Form.Label>
            <Check
              disabled={props.disabled}
              className="col-md-10"
              field={withNameSpace('statusId')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Classification
            </Form.Label>
            <FastSelect
              formikProps={props}
              disabled={props.disabled}
              outerClassName="col-md-10"
              placeholder="Must Select One"
              field={withNameSpace('classificationId')}
              options={classifications}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Lot Size
            </Form.Label>
            <InputGroup
              fast={true}
              disabled={props.disabled}
              outerClassName="col-md-7"
              type="number"
              field={withNameSpace('landArea')}
              formikProps={props}
              postText="Acres"
            />
          </Form.Row>

          <Form.Row>
            <Form.Label column md={2}>
              Sensitive Land
            </Form.Label>
            <Check disabled={props.disabled} field={withNameSpace('isSensitive')} />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default LandForm;
