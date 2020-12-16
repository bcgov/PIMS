import './ParcelIdentificationForm.scss';

import {
  FastInput,
  SelectOptions,
  Check,
  TextArea,
  InputGroup,
  Input,
} from 'components/common/form';
import { Label } from 'components/common/Label';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import React, { useState } from 'react';
import { useFormikContext, getIn } from 'formik';
import PidPinForm, { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import { sensitiveTooltip } from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { IGeocoderResponse } from 'hooks/useApi';
import styled from 'styled-components';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import classNames from 'classnames';
import SearchButton from 'components/common/form/SearchButton';
import { IAssociatedLand } from '../AssociatedLandForm';
import { ISteppedFormValues } from 'components/common/form/StepForm';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { noop } from 'lodash';
import { Container, Row, Col, Form } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface IIdentificationProps {
  /** used for changign the agency - note that only select users will be able to edit this field */
  agencies: SelectOptions;
  /** pass the options for classifications */
  classifications: SelectOptions;
  /** used for determining nameSpace of field */
  nameSpace?: any;
  /** for list fields (eg. buildings, financials) */
  index?: any;
  /** handle the population of Geocoder information */
  handleGeocoderChanges: (data: IGeocoderResponse, nameSpace?: string) => Promise<void>;
  /** help set the cursor type when click the add marker button */
  setMovingPinNameSpace: (nameSpace: string) => void;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string, nameSpace?: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string, nameSpace?: string) => void;
  /** whether or not this user is an admin and should have greater access to fields */
  isAdmin: boolean;
  /** whether or not this form is being displayed as part of a view or update */
  isViewOrUpdate: boolean;
  /** whether or not the fields on this form can be interacted with */
  disabled?: boolean;
}

const SearchMarkerButton = styled.button`
  // position: absolute;
  top: 20px;
  right: 20px;
  border: 0px;
  background-color: none;
  display: flex;
`;

export const ParcelIdentificationForm: React.FC<IIdentificationProps> = ({
  agencies,
  nameSpace,
  index,
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  isAdmin,
  isViewOrUpdate,
  disabled,
}) => {
  const [geocoderResponse, setGeocoderResponse] = useState<IGeocoderResponse | undefined>();
  const formikProps = useFormikContext<ISteppedFormValues<IAssociatedLand>>();
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  const agency = getIn(formikProps.values, withNameSpace('agencyId'));

  const MovePinComponent = () => (
    <>
      <Col md={12}>
        <h5>Update Parcel Location</h5>
      </Col>
      <Col md={12} className="instruction">
        <p style={{ textAlign: 'center' }}>
          Click on the pin, and then click on the new location on the map for this parcel.
        </p>
        <Row>
          <Col className="marker-svg">
            <SearchMarkerButton
              onClick={(e: any) => {
                setMovingPinNameSpace(nameSpace ?? '');
                e.preventDefault();
              }}
            >
              <ParcelDraftIcon className="parcel-icon" />
            </SearchMarkerButton>
          </Col>
        </Row>
      </Col>
    </>
  );

  const searchComponent = (
    <>
      <Col md={12}>
        <h5>Search for Parcel</h5>
      </Col>
      <Col md={6}>
        <Form.Row>
          <Label>PID</Label>
          <Input
            displayErrorTooltips
            className="input-small"
            disabled={false}
            pattern={RegExp(/^[\d\- ]*$/)}
            onBlurFormatter={(pid: string) => {
              if (pid?.length > 0) {
                return pid.replace(pid, pidFormatter(pid));
              }
              return '';
            }}
            field={withNameSpace('searchPid')}
          />
          <SearchButton
            onClick={(e: any) => {
              e.preventDefault();
              handlePidChange(getIn(formikProps.values, withNameSpace('searchPid')), nameSpace);
            }}
          />
        </Form.Row>
        <Form.Row>
          <Label>PIN</Label>
          <FastInput
            formikProps={formikProps}
            displayErrorTooltips
            className="input-small"
            disabled={false}
            field={withNameSpace('searchPin')}
            onBlurFormatter={(pin: number) => {
              if (pin > 0) {
                return pin;
              }
              return '';
            }}
            type="number"
          />
          <SearchButton
            onClick={(e: any) => {
              e.preventDefault();
              handlePinChange(getIn(formikProps.values, withNameSpace('searchPin')), nameSpace);
            }}
          />
        </Form.Row>
        <Form.Row>
          <Label>Street Address</Label>
          <GeocoderAutoComplete
            value={getIn(formikProps.values, withNameSpace('searchAddress'))}
            field={withNameSpace('searchAddress')}
            onSelectionChanged={selection => {
              formikProps.setFieldValue(withNameSpace('searchAddress'), selection.fullAddress);
              setGeocoderResponse(selection);
            }}
            onTextChange={value => formikProps.setFieldValue(withNameSpace('searchAddress'), value)}
            error={getIn(formikProps.errors, withNameSpace('searchAddress'))}
            touch={getIn(formikProps.touched, withNameSpace('searchAddress'))}
            displayErrorTooltips
          />
          <SearchButton
            onClick={(e: any) => {
              e.preventDefault();
              geocoderResponse && handleGeocoderChanges(geocoderResponse, nameSpace);
            }}
          />
        </Form.Row>
      </Col>
      <Col md={1}>
        <h5>OR</h5>
      </Col>
      <Col md={5} className="instruction">
        <p>
          Click on the pin, and then click your desired location on the map to pull the parcel
          details.
        </p>
        <Row>
          <Col className="marker-svg">
            <SearchMarkerButton
              onClick={(e: any) => {
                setMovingPinNameSpace(nameSpace ?? '');
                e.preventDefault();
              }}
            >
              <ParcelDraftIcon className="parcel-icon" />
            </SearchMarkerButton>
          </Col>
        </Row>
      </Col>
    </>
  );

  return (
    <Container>
      <Row>
        <h4>Parcel Identification</h4>
      </Row>
      {!disabled && (
        <Row noGutters className="section">
          {isViewOrUpdate ? <MovePinComponent /> : searchComponent}
        </Row>
      )}
      <Row
        noGutters
        className={classNames(
          'section',
          getIn(formikProps.values, withNameSpace('latitude')) === '' &&
            getIn(formikProps.values, withNameSpace('longitude')) === ''
            ? 'disabled'
            : '',
        )}
      >
        <Col md={12}>
          <h5>Parcel Details</h5>
        </Col>
        <Col md={6}>
          <PidPinForm
            nameSpace={nameSpace}
            handlePidChange={noop}
            handlePinChange={noop}
            disabled={disabled}
          />
          <AddressForm
            onGeocoderChange={noop}
            {...formikProps}
            disabled={disabled}
            nameSpace={withNameSpace('address')}
          />
          <Form.Row>
            <Form.Label>{agency?.parent ? 'Sub Agency' : 'Agency'}</Form.Label>
            <ParentSelect
              field={withNameSpace('agencyId')}
              options={agencies}
              filterBy={['code', 'label', 'parent']}
              disabled={!isAdmin || disabled}
            />
            {agency?.parent && (
              <Form.Row>
                <Form.Label>Agency</Form.Label>
                <FastInput
                  formikProps={formikProps}
                  field="parent"
                  disabled
                  value={agency.parent}
                  style={{ marginLeft: '5px' }}
                />
              </Form.Row>
            )}
          </Form.Row>
        </Col>
        <Col md={6} className="form-container">
          <Form.Row>
            <Label>Name</Label>
            <FastInput
              disabled={disabled}
              field={withNameSpace('name')}
              formikProps={formikProps}
            />
          </Form.Row>
          <Form.Row>
            <Label>Description</Label>
            <TextArea disabled={disabled} field={withNameSpace('description')} />
          </Form.Row>
          <Form.Row>
            <Label>Legal Description</Label>
            <TextArea
              required={true}
              disabled={disabled}
              field={withNameSpace('landLegalDescription')}
              displayErrorTooltips
            />
          </Form.Row>
          <Form.Row>
            <Label>Lot Size</Label>

            <InputGroup
              displayErrorTooltips
              fast={true}
              disabled={disabled}
              type="number"
              field={withNameSpace('landArea')}
              formikProps={formikProps}
              postText="Hectares"
            />
          </Form.Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="input-medium harmful">
            <p>
              Would this information be harmful if released?&nbsp;
              <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
                <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                  Policy
                </a>
              </TooltipWrapper>
            </p>
            <Check
              type="radio"
              field={withNameSpace('isSensitive')}
              radioLabelOne="Yes"
              radioLabelTwo="No"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
