import './LandOwnershipForm.scss';

import React, { useCallback } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { RadioButtonGroup } from 'components/common/form/RadioButtonGroup';
import { LeasedLand } from 'actions/parcelsActions';
import { useFormikContext, getIn } from 'formik';
import LeasedLandOther from './LeasedLandOther';
import { IGeocoderResponse } from 'hooks/useApi';

interface IIdentificationProps {
  nameSpace?: any;
  setMovingPinNameSpace: (nameSpace: string) => void;
  /** to autopopulate fields based on Geocoder information */
  handleGeocoderChanges: (data: IGeocoderResponse) => Promise<void>;
  /** to autopopulate fields based on Geocoder information */
  handlePidChange: (pid: string) => void;
}

export const LandOwnershipForm: React.FC<IIdentificationProps> = ({
  nameSpace,
  handleGeocoderChanges,
  handlePidChange,
}) => {
  const { values } = useFormikContext();
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
    },
    [nameSpace],
  );
  const leasedLandType = getIn(values, withNameSpace('leasedLand.type'));

  const renderRadioOption = (radioValue: LeasedLand) => {
    switch (+radioValue) {
      case LeasedLand.owned:
        return <p>Click Continue to enter the details of this associated parcel</p>;
      case LeasedLand.other:
        return <LeasedLandOther nameSpace={withNameSpace('leasedLand')} />;
    }
  };
  return (
    <Container>
      <Row>
        <h4>Add associated land</h4>
      </Row>
      <Row>
        <Col>
          <h5>Land ownership</h5>
        </Col>
      </Row>
      <Row>
        <p>
          This first section has to do with land ownership
          <br />
          In some cases, the land on which a building sits is owned by the same agency who owns the
          building and in other cases it is not.
          <br />
          <br />
          Please indicate:
          <br />
          <br />
        </p>
      </Row>
      <Row>
        <RadioButtonGroup
          field={withNameSpace('leasedLand.type')}
          options={[
            { label: 'This building is on land owned by my agency', value: LeasedLand.owned },
            { label: 'Other', value: LeasedLand.other },
          ]}
        ></RadioButtonGroup>
      </Row>
      <hr></hr>
      {renderRadioOption(leasedLandType)}
    </Container>
  );
};
