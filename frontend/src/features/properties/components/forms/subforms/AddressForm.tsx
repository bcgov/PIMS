import { ILookupCode } from 'actions/ILookupCode';
import { IAddress } from 'actions/parcelsActions';
import { FastInput, Select } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { Label } from 'components/common/Label';
import * as API from 'constants/API';
import { FormikProps, getIn } from 'formik';
import { IGeocoderResponse } from 'hooks/useApi';
import _ from 'lodash';
import { useCallback } from 'react';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { mapLookupCode } from 'utils';

import { GeocoderAutoComplete } from '../../GeocoderAutoComplete';
import { streetAddressTooltip } from '../strings';

interface AddressProps {
  nameSpace?: string;
  disabled?: boolean;
  onGeocoderChange?: (data: IGeocoderResponse) => void;
  toolTips?: boolean;
  hideStreetAddress?: boolean;
  disableStreetAddress?: boolean;
  /** disable the green checkmark that appears beside the input on valid entry */
  disableCheckmark?: boolean;
  // Use custom css for building review page of Submit a Building form
  buildingReviewStyles?: boolean;
  // Use custom css for land review page of Submit land form
  landReviewStyles?: boolean;
  // Use custom css for building information page of Submit a building form
  buildingInformationStyles?: boolean;
  // Use custom css for parcel information page of Submit land form
  parcelInformationStyles?: boolean;
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
const AddressForm = <T,>(props: AddressProps & FormikProps<T>) => {
  const lookupCodes = useAppSelector((store) => store.lookupCode.lookupCodes);
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
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col
            md="auto"
            style={{
              width: '140px',
              textAlign: 'right',
              marginRight: props.landReviewStyles ? '20px' : 0,
            }}
          >
            <Label>Street Address</Label>
          </Col>
          {props.buildingReviewStyles && (
            <Col md="auto" style={{}}>
              <div
                style={{
                  borderLeft: '1px solid black',
                  height: '30px',
                  marginRight: '20px',
                }}
              ></div>
            </Col>
          )}
          <Col md="auto">
            <GeocoderAutoComplete
              tooltip={props.toolTips ? streetAddressTooltip : undefined}
              value={getIn(props.values, withNameSpace('line1'))}
              disabled={props.disableStreetAddress || props.disabled}
              field={withNameSpace('line1')}
              onSelectionChanged={handleGeocoderChanges}
              onTextChange={(value) => props.setFieldValue(withNameSpace('line1'), value)}
              error={getIn(props.errors, withNameSpace('line1'))}
              touch={getIn(props.touched, withNameSpace('line1'))}
              displayErrorTooltips
              required={true}
            />
          </Col>
        </Row>
      )}
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col
          md="auto"
          style={{
            width: '140px',
            textAlign: 'right',
            marginRight: props.landReviewStyles ? '20px' : 0,
          }}
        >
          <Label>Location</Label>
        </Col>
        {props.buildingReviewStyles && (
          <Col md="auto" style={{}}>
            <div
              style={{
                borderLeft: '1px solid black',
                height: '30px',
                marginRight: '20px',
              }}
            ></div>
          </Col>
        )}
        <Col md="auto">
          <TypeaheadField
            options={administrativeAreas.map((x) => x.label)}
            name={withNameSpace('administrativeArea')}
            disabled={props.disabled}
            hideValidation={props.disableCheckmark}
            paginate={false}
            required
            displayErrorTooltips
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col
          md="auto"
          style={{
            width: '140px',
            textAlign: 'right',
            paddingRight: props.landReviewStyles ? '55px' : '12px',
            marginRight: props.buildingReviewStyles ? 0 : '-35px',
          }}
        >
          <Label>Province</Label>
        </Col>
        {props.buildingReviewStyles && (
          <Col md="auto" style={{}}>
            <div
              style={{
                borderLeft: '1px solid black',
                height: '30px',
                marginRight: '20px',
              }}
            ></div>
          </Col>
        )}
        <Col md="auto" style={{ paddingRight: 0 }}>
          <Select
            disabled={true}
            placeholder="Must Select One"
            field={withNameSpace('provinceId')}
            options={provinces}
          />
        </Col>
      </Row>
      <Row className="postal" style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col
          md="auto"
          style={{
            width: '140px',
            textAlign: 'right',
            marginLeft: props.landReviewStyles ? '-10px' : 0,
          }}
        >
          <Label>Postal Code</Label>
        </Col>
        <Col
          md="auto"
          style={{
            width:
              props.buildingReviewStyles || props.landReviewStyles
                ? '200px'
                : props.buildingInformationStyles
                ? '275px'
                : '250px',
          }}
        >
          <FastInput
            className="input-small"
            formikProps={props}
            style={{ width: '120px' }}
            disabled={props.disabled}
            onBlurFormatter={(postal: string) =>
              postal.replace(postal, postalCodeFormatter(postal))
            }
            field={withNameSpace('postal')}
            displayErrorTooltips
          />
        </Col>
      </Row>
    </>
  );
};

export default AddressForm;
