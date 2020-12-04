import './ParcelIdentificationForm.scss';

import {
  FastInput,
  SelectOptions,
  Check,
  TextArea,
  AutoCompleteText,
} from 'components/common/form';
import { Label } from 'components/common/Label';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import {
  sensitiveTooltip,
  streetAddressTooltip,
} from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { useFormikContext, getIn } from 'formik';
import PidPinForm from 'features/properties/components/forms/subforms/PidPinForm';
import { IGeocoderResponse } from 'hooks/useApi';
import styled from 'styled-components';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';

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
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
}

const DraftMarkerButton = styled.button`
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
}) => {
  const formikProps = useFormikContext();
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  return (
    <Container>
      <Row>
        <h4>Parcel Identification</h4>
      </Row>
      <Row noGutters>
        <Col md={6}>
          <PidPinForm
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            nameSpace={nameSpace}
          />
          <Row className="field-row">
            <Label>Street Address</Label>
            <GeocoderAutoComplete
              tooltip={streetAddressTooltip}
              value={getIn(formikProps.values, withNameSpace('address.line1'))}
              field={withNameSpace('address.line1')}
              onSelectionChanged={data => handleGeocoderChanges(data, nameSpace)}
              onTextChange={value =>
                formikProps.setFieldValue(withNameSpace('address.line1'), value)
              }
              error={getIn(formikProps.errors, withNameSpace('address.line1'))}
              touch={getIn(formikProps.touched, withNameSpace('address.line1'))}
              displayErrorTooltips
            />
          </Row>
        </Col>
        <Col md={1}>
          <h1>OR</h1>
        </Col>
        <Col md={5}>
          <p>
            Click on the pin, and then click your desired location on the map to pull the parcel
            details.
          </p>
          <Row>
            <Col className="marker-svg">
              <DraftMarkerButton
                onClick={(e: any) => {
                  setMovingPinNameSpace(nameSpace ?? '');
                  e.preventDefault();
                }}
              >
                <ParcelDraftIcon className="parcel-icon" />
              </DraftMarkerButton>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row noGutters>
        <Col md={6}>
          <AddressForm
            onGeocoderChange={handleGeocoderChanges}
            {...formikProps}
            disabled={false}
            nameSpace={withNameSpace('address')}
            hideStreetAddress
          />
          <Row className="field-row">
            <Label>Agency</Label>
            <AutoCompleteText disabled field={withNameSpace('agencyId')} options={agencies} />
          </Row>
        </Col>
        <Col md={6} className="form-container">
          <Row className="field-row">
            <Label>Name</Label>
            <FastInput disabled={false} field={withNameSpace('name')} formikProps={formikProps} />
          </Row>
          <Row className="field-row">
            <Label>Description</Label>
            <TextArea disabled={false} field={withNameSpace('description')} />
          </Row>
          <Row className="field-row">
            <Label>Legal Description</Label>
            <TextArea disabled={false} field={withNameSpace('legalDescription')} />
          </Row>
          <Row className="field-row">
            <Label>Lot Size</Label>
            <TextArea disabled={false} field={withNameSpace('legalDescription')} />
          </Row>
        </Col>
        <Col>
          <div className="input-medium harmful">
            <p>
              <span className="req">*</span>
              Would this information be harmful if released?&nbsp;
              <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
                <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                  Policy
                </a>
              </TooltipWrapper>
            </p>
            <Check
              type="radio"
              field={withNameSpace('data.isSensitive')}
              radioLabelOne="Yes"
              radioLabelTwo="No"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
