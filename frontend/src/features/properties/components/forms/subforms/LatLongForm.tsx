import { ReactComponent as BuildingDraftIcon } from 'assets/images/draft-building-icon.svg';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import { FastInput, Form, InputGroup } from 'components/common/form';
import { Label } from 'components/common/Label';
import { FormikProps } from 'formik';
import { useCallback } from 'react';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';
import styled from 'styled-components';

interface LatLongFormProps {
  setMovingPinNameSpace: (nameSpace?: string) => void;
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

const LatLongForm = <T,>(props: LatLongFormProps & FormikProps<T>) => {
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
          <div className="instruction" style={{ display: 'flex' }}>
            {props.building && (
              <p>
                Click your desired location on the map to mark the location of this building, or if
                you already have the coordinates, you can enter them in the fields below.
              </p>
            )}
            {!props.building && (
              <p>
                Click your desired location on the map to pull the parcel details. Or if you already
                have the coordinates, you can enter them manually in the fields below.
              </p>
            )}
          </div>
        </Col>
        <Col className="marker-svg">
          <ClickAwayListener
            onClickAway={() => {
              props.setMovingPinNameSpace(undefined);
            }}
          >
            <DraftMarkerButton
              disabled={props.disabled}
              onClick={(e: any) => {
                props.setMovingPinNameSpace(props.nameSpace ?? '');
                e.preventDefault();
              }}
            >
              {props.building ? <BuildingDraftIcon /> : <ParcelDraftIcon className="parcel-icon" />}
            </DraftMarkerButton>
          </ClickAwayListener>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Label>Latitude</Label>
        </Col>
        <Col>
          <FastInput
            className="input-medium"
            displayErrorTooltips
            formikProps={props}
            disabled={props.disabled}
            type="number"
            field={props.showLandArea ? withNameSpace('data.latitude') : withNameSpace('latitude')}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Label>Longitude</Label>
        </Col>
        <Col>
          <FastInput
            className="input-medium"
            displayErrorTooltips
            formikProps={props}
            disabled={props.disabled}
            type="number"
            field={
              props.showLandArea ? withNameSpace('data.longitude') : withNameSpace('longitude')
            }
            required
          />
        </Col>
      </Row>
      {props.showLandArea && (
        <Form.Group>
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
        </Form.Group>
      )}
    </div>
  );
};

export default LatLongForm;
