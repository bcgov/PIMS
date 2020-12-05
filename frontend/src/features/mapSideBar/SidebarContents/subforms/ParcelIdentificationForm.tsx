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
import React, { useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import {
  sensitiveTooltip,
  streetAddressTooltip,
} from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { useFormikContext, getIn, setIn } from 'formik';
import PidPinForm from 'features/properties/components/forms/subforms/PidPinForm';
import { IGeocoderResponse } from 'hooks/useApi';
import styled from 'styled-components';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import classNames from 'classnames';
import SearchButton from 'components/common/form/SearchButton';
import { IAssociatedLand } from '../AssociatedLandForm';
import { getInitialValues } from '../LandForm';
import { ISteppedFormValues } from 'components/common/form/StepForm';

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
}

const SearchMarkerButton = styled.button`
  // position: absolute;
  top: 20px;
  right: 20px;
  border: 0px;
  background-color: none;
  display: flex;
`;

const CenteredSearchButton = styled(SearchButton)`
  margin: auto;
  margin-bottom: 20px;
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
  const [geocoderResponse, setGeocoderResponse] = useState<IGeocoderResponse | undefined>();
  const formikProps = useFormikContext<ISteppedFormValues<IAssociatedLand>>();
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  const pid = getIn(formikProps.values, withNameSpace('pid'));
  const pin = getIn(formikProps.values, withNameSpace('pin'));
  return (
    <Container>
      <Row>
        <h4>Parcel Identification</h4>
      </Row>
      <Row noGutters className="section">
        <Col md={12}>
          <h5>Search for Parcel</h5>
        </Col>
        <Col md={6}>
          <PidPinForm
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            nameSpace={nameSpace}
          />
          <CenteredSearchButton
            onClick={(e: any) => {
              e.preventDefault();
              let newValues = {
                ...formikProps.values,
              };
              newValues = setIn(newValues, nameSpace, getInitialValues());

              formikProps.resetForm({
                values: newValues,
              });

              if (pid.length > 0) {
                handlePidChange(pid, nameSpace);
              } else if (pin.length > 0) {
                handlePinChange(pin, nameSpace);
              } else if (geocoderResponse) {
                handleGeocoderChanges(geocoderResponse, nameSpace);
              }
            }}
          />
          <Form.Row className="justify-content-end">
            <Label>Street Address</Label>
            <GeocoderAutoComplete
              required={true}
              tooltip={streetAddressTooltip}
              value={getIn(formikProps.values, withNameSpace('address.line1'))}
              field={withNameSpace('address.line1')}
              onSelectionChanged={selection => {
                formikProps.setFieldValue(withNameSpace('address.line1'), selection.fullAddress);
                setGeocoderResponse(selection);
              }}
              onTextChange={value =>
                formikProps.setFieldValue(withNameSpace('address.line1'), value)
              }
              error={getIn(formikProps.errors, withNameSpace('address.line1'))}
              touch={getIn(formikProps.touched, withNameSpace('address.line1'))}
              displayErrorTooltips
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
      </Row>
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
          <AddressForm
            onGeocoderChange={handleGeocoderChanges}
            {...formikProps}
            disabled={false}
            nameSpace={withNameSpace('address')}
            hideStreetAddress
          />
          <Form.Row>
            <Label>Agency</Label>
            <AutoCompleteText disabled field={withNameSpace('agencyId')} options={agencies} />
          </Form.Row>
        </Col>
        <Col md={6} className="form-container">
          <Form.Row>
            <Label>Name</Label>
            <FastInput disabled={false} field={withNameSpace('name')} formikProps={formikProps} />
          </Form.Row>
          <Form.Row>
            <Label>Description</Label>
            <TextArea disabled={false} field={withNameSpace('description')} />
          </Form.Row>
          <Form.Row>
            <Label>Legal Description</Label>
            <TextArea
              required={true}
              disabled={false}
              field={withNameSpace('landLegalDescription')}
              displayErrorTooltips
            />
          </Form.Row>
          <Form.Row>
            <Label>Lot Size</Label>
            <FastInput
              required={true}
              disabled={false}
              field={withNameSpace('landArea')}
              formikProps={formikProps}
            />
          </Form.Row>
        </Col>
      </Row>
      <Row>
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
