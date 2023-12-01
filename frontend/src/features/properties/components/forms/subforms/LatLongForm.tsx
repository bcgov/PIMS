import { FastInput, Form, InputGroup } from 'components/common/form';
import { Label } from 'components/common/Label';
import MapDropPin from 'features/mapSideBar/components/MapDropPin';
import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';

interface LatLongFormProps {
  setMovingPinNameSpace: (nameSpace?: string) => void;
  nameSpace?: string;
  disabled?: boolean;
  showLandArea?: boolean;
  /** determine the text for the lat long for depending on where it is being called */
  building?: boolean;
  /** function called when drop pin is placed */
  onPinDrop?: () => void;
}

export const defaultLatLongValues: any = {
  latitude: '',
  longitude: '',
};

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
                Select this pin then click your desired location on the map to mark the location of
                this building and populate known fields. If you already have the coordinates, you
                can enter them in the fields below.
              </p>
            )}
            {!props.building && (
              <p>
                Select this pin then click your desired location on the map to mark the location of
                this parcel and populate known fields. If you already have the coordinates, you can
                enter them in the fields below.
              </p>
            )}
          </div>
        </Col>
        <Col className="marker-svg">
          <MapDropPin
            setMovingPinNameSpace={props.setMovingPinNameSpace}
            isBuilding={props.building}
            nameSpace={props.nameSpace}
            disabled={props.disabled}
          />
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
