import { Fragment } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import * as API from 'constants/API';
import { Form, Input, Select } from 'components/common/form';
import { mapLookupCode } from 'utils';
import { Col } from 'react-bootstrap';
import { IAddress } from 'actions/parcelsActions';

interface AddressProps {
  nameSpace?: string;
  disabled?: boolean;
}

export const defaultAddressValues: IAddress = {
  line1: '',
  line2: undefined,
  city: undefined,
  cityId: '',
  province: undefined,
  provinceId: '',
  postal: '',
};
const AddressForm = <T extends unknown>(props: AddressProps & FormikProps<T>) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const provinces = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROVINCE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const cities = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.CITY_CODE_SET_NAME;
  }).map(mapLookupCode);
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <Fragment>
      <Col className="addressForm" md={6}>
        <Form.Row>
          <Form.Label column md={2}>
            Street Address
          </Form.Label>
          <Input disabled={props.disabled} className="col-md-10" field={withNameSpace('line1')} />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            City
          </Form.Label>
          <Select
            className="col-md-10"
            disabled={props.disabled}
            placeholder="Must Select One"
            field={withNameSpace('cityId')}
            options={cities}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            Province
          </Form.Label>
          <Select
            disabled={props.disabled}
            className="col-md-10"
            placeholder="Must Select One"
            field={withNameSpace('provinceId')}
            options={provinces}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            Postal
          </Form.Label>
          <Input disabled={props.disabled} className="col-md-10" field={withNameSpace('postal')} />
        </Form.Row>
      </Col>
    </Fragment>
  );
};

export default AddressForm;
