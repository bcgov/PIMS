import { useCallback } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { Form, FastInput, InputGroup } from 'components/common/form';
import { ReactComponent as BuildingDraftIcon } from 'assets/images/draft-building-icon.svg';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import styled from 'styled-components';
import { Label } from 'components/common/Label';
import { Col, Row } from 'react-bootstrap';

interface LatLongFormProps {
  setMovingPinNameSpace: (nameSpace: string) => void;
  nameSpace?: string;
  disabled?: boolean;
  showLandArea?: boolean;
  /** determine the text for the lat long for depending on where it is being called */
  building?: boolean;
}

export const defaultLatLongValues: any = {
  latitude: '',
  longitude: '',
};

const DraftMarkerButton = styled.button`
  // position: absolute;
  top: 20px;
  right: 20px;
  border: 0px;
  background-color: none;
  display: flex;
`;

const LatLongForm = <T extends any>(props: LatLongFormProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <div className="lat-long" style={{ position: 'relative' }}>
      <Row>
        <Col md={9}>
          <div className="instruction">
            {props.building && (
              <p>
                Drag and drop the pin on the map to mark the location of this building, or if you
                already have the coordinates, you can enter them manually in the fields below.
              </p>
            )}
            {!props.building && (
              <p>
                Drag and drop the pin on the map to mark the location of this parcel, or if you
                already have the coordinates, you can enter them manually in the fields below.
              </p>
            )}
          </div>
        </Col>
        <Col className="marker-svg">
          <DraftMarkerButton
            disabled={props.disabled}
            onClick={(e: any) => {
              props.setMovingPinNameSpace(props.nameSpace ?? '');
              e.preventDefault();
            }}
          >
            {props?.nameSpace?.includes('building') === true ? (
              <BuildingDraftIcon />
            ) : (
              <ParcelDraftIcon className="parcel-icon" />
            )}
          </DraftMarkerButton>
        </Col>
      </Row>
      <Form.Row>
        <Label required>Latitude</Label>
        <FastInput
          className="input-medium"
          displayErrorTooltips
          // tooltip={latitudeTooltip}
          formikProps={props}
          disabled={props.disabled}
          type="number"
          field={props.showLandArea ? withNameSpace('data.latitude') : withNameSpace('latitude')}
        />
      </Form.Row>
      <Form.Row>
        <Label required>Longitude</Label>
        <FastInput
          className="input-medium"
          displayErrorTooltips
          formikProps={props}
          disabled={props.disabled}
          type="number"
          field={props.showLandArea ? withNameSpace('data.longitude') : withNameSpace('longitude')}
        />
      </Form.Row>
      {props.showLandArea && (
        <Form.Row>
          <InputGroup
            displayErrorTooltips
            fast={true}
            disabled={props.disabled}
            label="Lot Size"
            required
            type="number"
            field={withNameSpace('data.landArea')}
            formikProps={props}
            postText="Hectares"
          />
        </Form.Row>
      )}
    </div>
  );
};

export default LatLongForm;
