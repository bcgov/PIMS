import './LandSearchForm.scss';

import { ContentPaste as PasteIcon } from '@mui/icons-material';
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { IParcel } from 'actions/parcelsActions';
import { FastInput, Input } from 'components/common/form';
import SearchButton from 'components/common/form/SearchButton';
import { ISteppedFormValues } from 'components/common/form/StepForm';
import { Label } from 'components/common/Label';
import MapDropPin from 'features/mapSideBar/components/MapDropPin';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { getIn, useFormikContext } from 'formik';
import { IGeocoderResponse } from 'hooks/useApi';
import React, { SyntheticEvent, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withNameSpace } from 'utils/formUtils';

import { ISearchFields } from '../LandForm';

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
  /** function called when drop pin is placed */
  onPinDrop?: () => void;
}

/**
 * Search component which displays a vertically stacked set of search fields, used to find matching parcels within pims or the parcel layer.
 * @param {ISearchFormProps} param0
 */
const LandSearchForm = ({
  nameSpace,
  handleGeocoderChanges,
  handlePidChange,
  handlePinChange,
  onPinDrop,
  setMovingPinNameSpace,
}: ISearchFormProps) => {
  const [geocoderResponse, setGeocoderResponse] = useState<IGeocoderResponse | undefined>();
  const [tab, setTab] = useState<number>(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const formikProps = useFormikContext<ISteppedFormValues<IParcel & ISearchFields>>();
  const { searchPin, searchPid, searchAddress } = getIn(
    formikProps.values,
    withNameSpace(nameSpace),
  );

  const handlePasteFromClipboard = (field: string) => {
    navigator.clipboard
      .readText()
      .then((text) => {
        formikProps.setFieldValue(withNameSpace(nameSpace, field), text);
        const input: unknown = document.getElementsByName(`data.${field}`)[0];
        if ((input as HTMLInputElement).type === 'text') (input as HTMLInputElement).value = text;
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  };

  return (
    <Row className="section g-0" id="land-search-form">
      <Col md={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="property search tabs">
            <Tab label="Search for Property" id="parcel-search-tab" />
            <Tab label="Select a Parcel from the Map" id="parcel-marker-tab" />
          </Tabs>
        </Box>

        {/* Search Tab */}
        <Box role="tabpanel" hidden={tab !== 0} id="parcel-tabpanel-search" sx={{ p: 3 }}>
          <Row className="row">
            <Col xs={2} className="left-column">
              <Label>PID</Label>
            </Col>
            <Col xs={4}>
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
                id="pid-field"
              />
            </Col>
            <Col md="auto">
              <IconButton onClick={() => handlePasteFromClipboard('searchPid')} id="pid-paste">
                <Tooltip title="Paste From Clipboard">
                  <PasteIcon />
                </Tooltip>
              </IconButton>
            </Col>
            <Col md="auto">
              <SearchButton
                id="pid-search"
                onClick={(e: any) => {
                  e.preventDefault();
                  handlePidChange(searchPid, nameSpace);
                }}
              />
            </Col>
          </Row>
          <Row className="row">
            <Col xs={2} className="left-column">
              <Label>PIN</Label>
            </Col>
            <Col xs={4}>
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
                id="pin-field"
              />
            </Col>
            <Col md="auto">
              <IconButton onClick={() => handlePasteFromClipboard('searchPin')} id="pin-paste">
                <Tooltip title="Paste From Clipboard">
                  <PasteIcon />
                </Tooltip>
              </IconButton>
            </Col>
            <Col md="auto">
              <SearchButton
                onClick={(e: any) => {
                  e.preventDefault();
                  handlePinChange(searchPin, nameSpace);
                }}
                id="pin-search"
              />
            </Col>
          </Row>
          <Row className="row">
            <Col xs={2} className="left-column">
              <Label>Street Address</Label>
            </Col>
            <Col xs={4}>
              <GeocoderAutoComplete
                value={searchAddress}
                field={withNameSpace(nameSpace, 'searchAddress')}
                onSelectionChanged={(selection) => {
                  formikProps.setFieldValue(
                    withNameSpace(nameSpace, 'searchAddress'),
                    selection.fullAddress,
                  );
                  setGeocoderResponse(selection);
                }}
                onTextChange={(value) => {
                  if (value !== geocoderResponse?.address1) {
                    setGeocoderResponse(undefined);
                  }
                  formikProps.setFieldValue(withNameSpace(nameSpace, 'searchAddress'), value);
                }}
                error={getIn(formikProps.errors, withNameSpace(nameSpace, 'searchAddress'))}
                touch={getIn(formikProps.touched, withNameSpace(nameSpace, 'searchAddress'))}
                displayErrorTooltips
              />
            </Col>
            <Col md="auto">
              <IconButton onClick={() => handlePasteFromClipboard('searchAddress')}>
                <Tooltip title="Paste From Clipboard">
                  <PasteIcon />
                </Tooltip>
              </IconButton>
            </Col>
            <Col md="auto">
              <SearchButton
                id="address-search"
                disabled={!geocoderResponse}
                onClick={(e: any) => {
                  e.preventDefault();
                  geocoderResponse && handleGeocoderChanges(geocoderResponse, nameSpace);
                }}
              />
            </Col>
          </Row>
        </Box>

        {/* Marker Tab */}
        <Box role="tabpanel" hidden={tab !== 1} id="parcel-tabpanel-marker" sx={{ p: 3 }}>
          <Row className="row">
            <Col md="auto">
              Select this pin and then select a parcel on the map to populate the Parcel Details
              below.
            </Col>
            <Col className="marker-svg">
              <MapDropPin
                onPinDrop={onPinDrop}
                setMovingPinNameSpace={setMovingPinNameSpace}
                nameSpace={nameSpace}
              />
            </Col>
          </Row>
        </Box>
      </Col>
    </Row>
  );
};

export default LandSearchForm;
