import { FunctionComponent, Fragment } from 'react';
import React from 'react';
import { Row, Col, Form as BForm } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { Field, ErrorMessage, FormikProps } from 'formik';
import * as API from 'constants/API';
import { FormikLookupCodeDropdown } from 'components/common/LookupCodeDropdown';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { Form, Input, Select } from 'components/common/form';
import { mapLookupCode } from 'utils';
import { Check } from 'components/common/form/Check';

interface LandProps {
  nameSpace?: string;
  formikProps?: any;
}

export const defaultLandValues: API.IParcel = {
  pid: '',
  agencyId: '',
  address: null,
  description: '',
  landLegalDescription: '',
  pin: '',
  zoning: '',
  zoningPotential: '',
  landArea: '',
  statusId: 1,
  classificationId: '',
  isSensitive: false,
  latitude: '',
  longitude: '',
  evaluations: [],
  buildings: [],
};
const LandForm = <T extends any>(props: LandProps & FormikProps<T>) => {
  const nameSpacedPropValues = props.values[props.nameSpace!];
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
              Zoning
            </Form.Label>
            <Input className="col-md-10" field={withNameSpace('zoning')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Zoning Potential
            </Form.Label>
            <Input className="col-md-10" field={withNameSpace('zoningPotential')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Latitude
            </Form.Label>
            <Input type="number" className="col-md-10" field={withNameSpace('latitude')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Longitude
            </Form.Label>
            <Input type="number" className="col-md-10" field={withNameSpace('longitude')} />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Active
            </Form.Label>
            <Check className="col-md-10" field={withNameSpace('statusId')} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Classification
            </Form.Label>
            <Select
              className="col-md-10"
              placeholder="Must Select One"
              field={withNameSpace('classificationId')}
              options={classifications}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Lot Size
            </Form.Label>
            <Input className="col-md-10" type="number" field={withNameSpace('landArea')} />
          </Form.Row>

          <Form.Row>
            <Form.Label column md={2}>
              Sensitive Land
            </Form.Label>
            <Check field={withNameSpace('isSensitive')} />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default LandForm;
