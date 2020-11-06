import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormikProps, getIn } from 'formik';
import React from 'react';
import AddressForm, { defaultAddressValues } from './AddressForm';
import EvaluationForm, { defaultFinancials } from './EvaluationForm';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { Form, FastDatePicker, FastSelect, InputGroup, FastInput } from 'components/common/form';
import { Check } from 'components/common/form/Check';
import { mapLookupCode, formikFieldMemo } from 'utils';
import * as API from 'constants/API';
import { IBuilding } from 'actions/parcelsActions';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import { IGeocoderResponse } from 'hooks/useApi';
import InformationForm from './InformationForm';
import LatLongForm from './LatLongForm';

export interface IFormBuilding extends IBuilding {
  financials: any;
}

export const defaultBuildingValues: any = {
  id: undefined,
  name: '',
  projectNumber: '',
  description: '',
  address: defaultAddressValues,
  latitude: '',
  longitude: '',
  agencyId: 0,
  parcelId: 0,
  rentableArea: '',
  buildingFloorCount: '',
  buildingConstructionType: undefined,
  buildingConstructionTypeId: '',
  buildingPredominateUse: undefined,
  buildingPredominateUseId: '',
  classificationId: '',
  classification: undefined,
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
  setMovingPinNameSpace: (nameSpace: string) => void;
  nameSpace?: string;
  index?: number;
  disabled?: boolean;
  allowEdit?: boolean;
}

const BuildingForm = (props: BuildingProps & FormikProps<any>) => {
  const keycloak = useKeycloakWrapper();

  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const classifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME;
  }).map(mapLookupCode);
  const constructionType = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.CONSTRUCTION_CODE_SET_NAME;
  }).map(mapLookupCode);
  const predominateUses = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PREDOMINATE_USE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const occupantTypes = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.OCCUPANT_TYPE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  }).map(mapLookupCode);
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [props.nameSpace ?? '', `${props.index ?? ''}`, name].filter(x => x).join('.');
    },
    [props.nameSpace, props.index],
  );
  const [readonly, setReadonly] = useState(false);
  React.useEffect(() => {
    if (props.nameSpace && props.index !== undefined) {
      setReadonly(
        !!props.values[props.nameSpace as string][props.index].projectNumber &&
          !keycloak.hasClaim(Claims.ADMIN_PROPERTIES),
      );
    } else {
      setReadonly(false);
    }
  }, [keycloak, props.values, props.nameSpace, props.index]);
  //set the lat/lon of this building, but only if the building lat/lon has no value.
  if (!getIn(props.values, withNameSpace('latitude')) && props.values.latitude) {
    props.setFieldValue(withNameSpace('latitude'), props.values.latitude);
  }
  if (!getIn(props.values, withNameSpace('longitude')) && props.values.longitude) {
    props.setFieldValue(withNameSpace('longitude'), props.values.longitude);
  }

  const handleGeocoderChanges = (data: IGeocoderResponse) => {
    if (data) {
      const newValues = {
        ...(props.values as any),
      };

      newValues.buildings[props.index!].address.line1 = data.fullAddress;
      newValues.buildings[props.index!].latitude = data.latitude;
      newValues.buildings[props.index!].longitude = data.longitude;

      const administrativeArea = data.administrativeArea
        ? lookupCodes.find(code => {
            return (
              code.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME &&
              code.name === data.administrativeArea
            );
          })
        : undefined;

      if (administrativeArea) {
        newValues.buildings[props.index!].address.cityId = administrativeArea.id;
        newValues.buildings[props.index!].address.city = administrativeArea.name;
      }

      const province = data.provinceCode
        ? lookupCodes.find(code => {
            return code.type === API.PROVINCE_CODE_SET_NAME && code.code === data.provinceCode;
          })
        : undefined;

      if (province) {
        newValues.buildings[props.index!].address.provinceId = province.code;
        newValues.buildings[props.index!].address.province = province.name;
      }
      props.setValues(newValues);
    }
  };

  return (
    <>
      <Row noGutters key={withNameSpace()} className="buildingForm" style={{ marginBottom: 0 }}>
        <Col md={6}>
          <InformationForm
            nameSpace={withNameSpace('')}
            classifications={classifications}
            agencies={agencies}
            isAdmin={keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
            disabled={props.disabled || readonly}
          />
        </Col>
        <Col md={6}>
          <AddressForm
            {...props}
            nameSpace={withNameSpace('address')}
            disabled={props.disabled || readonly}
            onGeocoderChange={handleGeocoderChanges}
          />
          <LatLongForm
            {...props}
            nameSpace={withNameSpace()}
            disabled={props.disabled || readonly}
            setMovingPinNameSpace={props.setMovingPinNameSpace}
          />
        </Col>
      </Row>
      <div className="scroll">
        <h4>Information</h4>
        <Row noGutters>
          <Col md={6}>
            <Form.Row>
              <Form.Label className="required">Predominate Use</Form.Label>
              <FastSelect
                formikProps={props}
                disabled={props.disabled || readonly}
                placeholder="Must Select One"
                field={withNameSpace('buildingPredominateUseId')}
                type="number"
                options={predominateUses}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label className="required">Type of Construction</Form.Label>
              <FastSelect
                formikProps={props}
                disabled={props.disabled || readonly}
                placeholder="Must Select One"
                field={withNameSpace('buildingConstructionTypeId')}
                type="number"
                options={constructionType}
              />
            </Form.Row>
          </Col>
          <Col md={6}>
            <Form.Row>
              <Form.Label className="required">Rentable Area</Form.Label>
              <InputGroup
                displayErrorTooltips
                fast={true}
                formikProps={props}
                disabled={props.disabled || readonly}
                type="number"
                field={withNameSpace('rentableArea')}
                postText="Sq. Ft"
              />
            </Form.Row>
            <Form.Row>
              <Form.Label>Number of Floors</Form.Label>
              <FastInput
                displayErrorTooltips
                className="input-small"
                formikProps={props}
                disabled={props.disabled || readonly}
                field={withNameSpace('buildingFloorCount')}
                type="number"
              />
            </Form.Row>
          </Col>
        </Row>
        <h4>Tenancy</h4>
        <Row className="buildingTenancy" noGutters>
          <Col md={6}>
            <Form.Row>
              <Form.Label className="required">Type of Current Occupant</Form.Label>
              <FastSelect
                formikProps={props}
                disabled={props.disabled || readonly}
                placeholder="Must Select One"
                field={withNameSpace('buildingOccupantTypeId')}
                type="number"
                options={occupantTypes}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label>Occupant Name</Form.Label>
              <FastInput
                displayErrorTooltips
                formikProps={props}
                disabled={props.disabled || readonly}
                field={withNameSpace('occupantName')}
              />
            </Form.Row>
          </Col>
          <Col md={6}>
            <Form.Row>
              <Form.Label>Tenancy %</Form.Label>
              <FastInput
                displayErrorTooltips
                formikProps={props}
                disabled={props.disabled || readonly}
                field={withNameSpace('buildingTenancy')}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label>Date Lease Expires</Form.Label>
              <FastDatePicker
                formikProps={props}
                disabled={props.disabled || readonly}
                field={withNameSpace('leaseExpiry')}
              />
              <Check
                postLabel="Lease to be transferred with land"
                disabled={props.disabled || readonly}
                field={withNameSpace('transferLeaseOnSale')}
              />
            </Form.Row>
          </Col>
        </Row>
        <Row noGutters>
          <Col>
            <h4>Building Valuation Information</h4>
            <EvaluationForm
              {...props}
              nameSpace={withNameSpace('financials')}
              disabled={props.disabled || readonly}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default React.memo(BuildingForm, (prevProps, currentProps) => {
  const prev = { formikProps: prevProps, field: prevProps.nameSpace };
  const curr = { formikProps: currentProps, field: currentProps.nameSpace };
  return formikFieldMemo(prev, curr) && prevProps.disabled !== currentProps.disabled;
});
