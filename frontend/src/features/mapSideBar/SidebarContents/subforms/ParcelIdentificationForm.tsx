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
import LatLongForm from 'features/properties/components/forms/subforms/LatLongForm';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { senstiveTooltip as sensitiveTooltip } from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { useFormikContext } from 'formik';
import PidPinForm from 'features/properties/components/forms/subforms/PidPinForm';

interface IIdentificationProps {
  agencies: SelectOptions;
  classifications: SelectOptions;
  nameSpace?: any;
  index?: any;
  handleGeocoderChanges: any;
  setMovingPinNameSpace: (nameSpace: string) => void;
  handlePidChange: (pid: string) => void;
  handlePinChange: (pin: string) => void;
}

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
        <Col md={6} className="form-container">
          <Row noGutters className="pid-pin">
            <PidPinForm
              nameSpace="data"
              handlePidChange={handlePidChange}
              handlePinChange={handlePinChange}
            />
          </Row>
          <Row className="field-row">
            <Label>Agency</Label>
            <AutoCompleteText disabled field={withNameSpace('data.agencyId')} options={agencies} />
            {/* <TypeaheadField name={withNameSpace('data.agencyId')} options={agencies} /> */}
          </Row>
          <Row className="field-row">
            <Label>Name</Label>
            <FastInput
              disabled={false}
              field={withNameSpace('data.name')}
              formikProps={formikProps}
            />
          </Row>
          <Row className="field-row">
            <Label>Description</Label>
            <TextArea disabled={false} field={withNameSpace('data.description')} />
          </Row>
          <AddressForm
            onGeocoderChange={handleGeocoderChanges}
            {...formikProps}
            disabled={false}
            nameSpace="data.address"
          />
        </Col>
        <Col md={6}>
          <LatLongForm
            showLandArea
            setMovingPinNameSpace={setMovingPinNameSpace}
            {...formikProps}
          />
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
