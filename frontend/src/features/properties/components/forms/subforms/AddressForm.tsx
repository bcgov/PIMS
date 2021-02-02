import { useCallback } from 'react';
import React from 'react';
import { FormikProps, getIn } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import * as API from 'constants/API';
import { FastInput, Select } from 'components/common/form';
import { mapLookupCode } from 'utils';
import { IAddress } from 'actions/parcelsActions';
import { GeocoderAutoComplete } from '../../GeocoderAutoComplete';
import { IGeocoderResponse } from 'hooks/useApi';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { streetAddressTooltip } from '../strings';
import { Label } from 'components/common/Label';
import { Form } from 'react-bootstrap';

interface AddressProps {
  nameSpace?: string;
  disabled?: boolean;
  onGeocoderChange?: (data: IGeocoderResponse) => void;
  toolTips?: boolean;
  hideStreetAddress?: boolean;
  disableStreetAddress?: boolean;
  /** disable the green checkmark that appears beside the input on valid entry */
  disableCheckmark?: boolean;
}

export const defaultAddressValues: IAddress = {
  id: 0,
  line1: '',
  line2: undefined,
  administrativeArea: '',
  province: undefined,
  provinceId: 'BC',
  postal: '',
};
const AddressForm = <T extends any>(props: AddressProps & FormikProps<T>) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const provinces = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROVINCE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const administrativeAreas = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME;
  }).map(mapLookupCode);

  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  const handleGeocoderChanges = (data: IGeocoderResponse) => {
    if (data && props.onGeocoderChange) {
      props.onGeocoderChange(data);
    }
  };

  /**
   * postalCodeFormatter takes the specified postal code and formats it with a space in the middle
   * @param {string} postal The target postal to be formatted
   */
  const postalCodeFormatter = (postal: string) => {
    const regex = /([a-zA-z][0-9][a-zA-z])[\s-]?([0-9][a-zA-z][0-9])/;
    const format = postal.match(regex);
    if (format !== null && format.length === 3) {
      postal = `${format[1]} ${format[2]}`;
    }
    return postal.toUpperCase();
  };

  return (
    <>
      {props.hideStreetAddress !== true && (
        <Form.Row>
          <Label>Street Address</Label>
          <GeocoderAutoComplete
            tooltip={props.toolTips ? streetAddressTooltip : undefined}
            value={getIn(props.values, withNameSpace('line1'))}
            disabled={props.disableStreetAddress || props.disabled}
            field={withNameSpace('line1')}
            onSelectionChanged={handleGeocoderChanges}
            onTextChange={value => props.setFieldValue(withNameSpace('line1'), value)}
            error={getIn(props.errors, withNameSpace('line1'))}
            touch={getIn(props.touched, withNameSpace('line1'))}
            displayErrorTooltips
            required={true}
          />
        </Form.Row>
      )}
      <Form.Row>
        <Label>Location</Label>
        <TypeaheadField
          options={administrativeAreas.map(x => x.label)}
          name={withNameSpace('administrativeArea')}
          disabled={props.disabled}
          hideValidation={props.disableCheckmark}
          paginate={false}
          required
          displayErrorTooltips
        />
      </Form.Row>
      <Form.Row>
        <Label>Province</Label>
        <Select
          disabled={true}
          placeholder="Must Select One"
          field={withNameSpace('provinceId')}
          options={provinces}
        />
      </Form.Row>
      <Form.Row className="postal">
        <Label>Postal Code</Label>
        <FastInput
          className="input-small"
          formikProps={props}
          style={{ width: '120px' }}
          disabled={props.disabled}
          onBlurFormatter={(postal: string) => postal.replace(postal, postalCodeFormatter(postal))}
          field={withNameSpace('postal')}
          displayErrorTooltips
        />
      </Form.Row>
    </>
  );
};

export default AddressForm;
