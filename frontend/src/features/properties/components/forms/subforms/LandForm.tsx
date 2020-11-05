import { Fragment, useCallback } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import * as API from 'constants/API';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import {
  Form,
  FastSelect,
  InputGroup,
  FastInput,
  AutoCompleteText,
  SelectOption,
} from 'components/common/form';
import { mapLookupCode } from 'utils';
import { Check } from 'components/common/form/Check';
import { IParcel } from 'actions/parcelsActions';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import { senstiveTooltip as sensitiveTooltip } from '../strings';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';

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
  address: undefined,
  name: '',
  description: '',
  landLegalDescription: '',
  pin: '',
  zoning: '',
  zoningPotential: '',
  landArea: '',
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
  const keycloak = useKeycloakWrapper();
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );

  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  const isAdmin = keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  const classifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return (
      lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME &&
      (isAdmin || !!lookupCode.isVisible)
    );
  }).map(mapLookupCode);
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  }).map(mapLookupCode);

  return (
    <Fragment>
      <Form.Row className="landForm">
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Current Zoning
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
              Potential Zoning
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
          <Form.Row>
            <Form.Label column md={2}>
              Agency
            </Form.Label>
            <AutoCompleteText
              field={withNameSpace('agencyId')}
              options={agencies}
              disabled={!keycloak.hasClaim(Claims.ADMIN_PROPERTIES) || props.disabled}
              getValueDisplay={(val: SelectOption) => val.code!}
              agencyType="parent"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Sub-Agency
            </Form.Label>
            <AutoCompleteText
              field={withNameSpace('agencyId')}
              options={agencies}
              disabled={!keycloak.hasClaim(Claims.ADMIN_PROPERTIES) || props.disabled}
              getValueDisplay={(val: SelectOption) => val.code!}
              agencyType="child"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Classification
            </Form.Label>
            <FastSelect
              formikProps={props}
              disabled={props.disabled}
              type="number"
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
              postText="Hectares"
            />
          </Form.Row>

          <Form.Row>
            <Form.Label column md={12}>
              Harmful if Released?{' '}
              <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
                <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                  Policy
                </a>
              </TooltipWrapper>
            </Form.Label>
            <Check
              type="radio"
              disabled={props.disabled}
              field={withNameSpace('isSensitive')}
              outerClassName="col-md-10"
              radioLabelOne="Yes"
              radioLabelTwo="No"
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default LandForm;
