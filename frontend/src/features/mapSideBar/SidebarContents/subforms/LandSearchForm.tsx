import SearchButton from 'components/common/form/SearchButton';
import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { Input, FastInput } from 'components/common/form';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import { withNameSpace } from 'utils/formUtils';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { getIn, useFormikContext } from 'formik';
import ClickAwayListener from 'react-click-away-listener';
import { IGeocoderResponse } from 'hooks/useApi';
import { IParcel } from 'actions/parcelsActions';
import { ISteppedFormValues } from 'components/common/form/StepForm';
import { ISearchFields } from '../LandForm';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import styled from 'styled-components';

const SearchMarkerButton = styled.button`
  top: 20px;
  right: 20px;
  border: 0px;
  background-color: none;
  display: flex;
`;

interface ISearchFormProps {
  /** used for determining nameSpace of field */
  nameSpace?: string;
  /** handle the population of Geocoder information */
  handleGeocoderChanges: (data: IGeocoderResponse, nameSpace?: string) => Promise<void>;
  /** help set the cursor type when click the add marker button */
  setMovingPinNameSpace: (nameSpace?: string) => void;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string, nameSpace?: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string, nameSpace?: string) => void;
}

/**
 * Search component which displays a vertically stacked set of search fields, used to find matching parcels within pims or the parcel layer.
 * @param {ISearchFormProps} param0
 */
const LandSearchForm = ({
  nameSpace,
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  ...props
}: ISearchFormProps) => {
  const [geocoderResponse, setGeocoderResponse] = useState<IGeocoderResponse | undefined>();

  const formikProps = useFormikContext<ISteppedFormValues<IParcel & ISearchFields>>();
  const { searchPin, searchPid, searchAddress } = getIn(
    formikProps.values,
    withNameSpace(nameSpace),
  );
  return (
    <Row noGutters className="section">
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
            field={withNameSpace(nameSpace, 'searchPid')}
          />
          <SearchButton
            onClick={(e: any) => {
              e.preventDefault();
              handlePidChange(searchPid, nameSpace);
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
            field={withNameSpace(nameSpace, 'searchPin')}
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
              handlePinChange(searchPin, nameSpace);
            }}
          />
        </Form.Row>
        <Form.Row>
          <Label>Street Address</Label>
          <GeocoderAutoComplete
            value={searchAddress}
            field={withNameSpace(nameSpace, 'searchAddress')}
            onSelectionChanged={selection => {
              formikProps.setFieldValue(withNameSpace('searchAddress'), selection.fullAddress);
              setGeocoderResponse(selection);
            }}
            onTextChange={value => {
              if (value !== geocoderResponse?.address1) {
                setGeocoderResponse(undefined);
              }
              formikProps.setFieldValue(withNameSpace(nameSpace, 'searchAddress'), value);
            }}
            error={getIn(formikProps.errors, withNameSpace(nameSpace, 'searchAddress'))}
            touch={getIn(formikProps.touched, withNameSpace(nameSpace, 'searchAddress'))}
            displayErrorTooltips
          />
          <SearchButton
            disabled={!geocoderResponse}
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
            <ClickAwayListener
              onClickAway={() => {
                setMovingPinNameSpace(undefined);
              }}
            >
              <SearchMarkerButton
                type="button"
                onClick={(e: any) => {
                  setMovingPinNameSpace(nameSpace ?? '');
                  e.preventDefault();
                }}
              >
                <ParcelDraftIcon className="parcel-icon" />
              </SearchMarkerButton>
            </ClickAwayListener>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LandSearchForm;
