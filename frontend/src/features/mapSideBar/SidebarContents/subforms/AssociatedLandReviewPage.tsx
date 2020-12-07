import './AssociatedLandReviewPage.scss';

import {
  FastInput,
  Input,
  InputGroup,
  AutoCompleteText,
  FastCurrencyInput,
  Check,
  FastSelect,
} from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { LandSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import { useFormStepper } from 'components/common/form/StepForm';
import { AssociatedLandSteps } from 'constants/propertySteps';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
}

const EmptyParcel = ({ index }: any) => {
  const stepper = useFormStepper();
  return (
    <div className="parcel-content" style={{ padding: '40px' }}>
      <p>The information for this parcel has not yet been added</p>
      <Button variant="secondary" onClick={() => stepper.gotoTab(index)}>
        Add Parcel Info
      </Button>
    </div>
  );
};

export const AssociatedLandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const defaultEditValues = {
    identification: true,
    usage: true,
    valuation: true,
  };
  const stepper = useFormStepper();
  const [editInfo, setEditInfo] = useState(defaultEditValues);
  const withNameSpace: Function = useCallback(
    (fieldName: string, index: number) => {
      return props.nameSpace ? `${props.nameSpace}.${index}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const formikProps = useFormikContext<any>();

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review associated land information</h4>
        <p>
          Please review the information you have entered. You can edit it by clicking on the edit
          icon for each section. When you are satisfied that the infomation provided is correct,
          click the submit button to save this information to the PIMS inventory.
        </p>
      </Row>
      {formikProps?.values?.tabs?.map((tab: any, index: number) => (
        <Row className="parcel-pane">
          <Col>
            <Row className="parcel-header">
              <Col>
                <h4>{formikProps?.values.tabs[index].name}</h4>
                <h4>
                  {index + 1}/{formikProps?.values?.tabs?.length ?? 1}
                </h4>
              </Col>
            </Row>
            {stepper.getTabCurrentStep(index) !== AssociatedLandSteps.REVIEW ? (
              <EmptyParcel index={index} />
            ) : (
              <div className="parcel-content">
                <Row>
                  <Col className="identification">
                    <Row>
                      <Col md={12}>
                        <Row className="section-header">
                          <span>
                            <LandSvg className="svg" />
                            <h5>Parcel Identification</h5>
                          </span>
                          <FaEdit
                            size={20}
                            className="edit"
                            onClick={() =>
                              setEditInfo({
                                ...defaultEditValues,
                                identification: !editInfo.identification,
                              })
                            }
                          />
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="content-item">
                          <Label>Agency</Label>
                          <AutoCompleteText
                            field={withNameSpace('agencyId', index)}
                            options={props.agencies}
                            disabled={editInfo.identification}
                          />
                        </Row>
                        <Row className="content-item">
                          <Label>Land Name</Label>
                          <Input
                            disabled={editInfo.identification}
                            field={withNameSpace('name', index)}
                          />
                        </Row>
                        <Row className="content-item">
                          <Label>Description</Label>
                          <FastInput
                            disabled={editInfo.identification}
                            field={withNameSpace('description', index)}
                            formikProps={formikProps}
                          />
                        </Row>

                        <AddressForm
                          onGeocoderChange={noop}
                          {...formikProps}
                          disabled={editInfo.identification}
                          nameSpace={withNameSpace('address', index)}
                        />
                      </Col>
                      <Col md={6}>
                        <p className="break"></p>
                        <Row className="content-item">
                          <Label>PID/PIN</Label>
                          <Input
                            displayErrorTooltips
                            className="input-small"
                            disabled={editInfo.identification}
                            field={
                              (formikProps.values as any).data.pid
                                ? withNameSpace('pid', index)
                                : withNameSpace('pin', index)
                            }
                          />
                        </Row>
                        <Row className="content-item">
                          <Label>Lot Size</Label>

                          <InputGroup
                            displayErrorTooltips
                            fast={true}
                            disabled={editInfo.identification}
                            type="number"
                            field={withNameSpace('landArea', index)}
                            formikProps={formikProps}
                            postText="Hectares"
                          />
                        </Row>
                        <Row className="content-item">
                          <Label>SPP</Label>
                          <FastInput
                            className="input-medium"
                            displayErrorTooltips
                            formikProps={formikProps}
                            disabled={editInfo.identification}
                            type="text"
                            field={withNameSpace('projectNumber', index)}
                          />
                        </Row>
                        <br></br>
                        <Row className="harmful">
                          <Label>Harmful info if released?</Label>
                          <Check
                            type="radio"
                            field={withNameSpace('isSensitive', index)}
                            radioLabelOne="Yes"
                            radioLabelTwo="No"
                            disabled={editInfo.identification}
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Row>
                      <div className="usage">
                        <Row className="section-header">
                          <span>
                            <LandSvg className="svg" />
                            <h5>Usage</h5>
                          </span>
                          <FaEdit
                            size={20}
                            className="edit"
                            onClick={() =>
                              setEditInfo({ ...defaultEditValues, usage: !editInfo.usage })
                            }
                          />
                        </Row>
                        <Row className="classification field-row">
                          <Label>Classification</Label>
                          <FastSelect
                            formikProps={formikProps}
                            disabled={editInfo.usage}
                            type="number"
                            placeholder="Must Select One"
                            field={withNameSpace('classificationId', index)}
                            options={props.classifications}
                          />
                        </Row>
                        <Row className="field-row">
                          <Label>Current Zoning</Label>
                          <FastInput
                            formikProps={formikProps}
                            disabled={editInfo.usage}
                            field={withNameSpace('zoning', index)}
                          />
                        </Row>
                        <Row className="field-row">
                          <Label>Potential Zoning</Label>
                          <FastInput
                            formikProps={formikProps}
                            disabled={editInfo.usage}
                            field={withNameSpace('zoningPotential', index)}
                          />
                        </Row>
                      </div>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <div className="valuation">
                        <Row className="section-header">
                          <span>
                            <LandSvg className="svg" />
                            <h5>Valuation</h5>
                          </span>
                          <FaEdit
                            size={20}
                            className="edit"
                            onClick={() =>
                              setEditInfo({ ...defaultEditValues, valuation: !editInfo.valuation })
                            }
                          />
                        </Row>
                        <Row className="val-row">
                          <Label>Net Book Value</Label>
                          <FastCurrencyInput
                            formikProps={formikProps}
                            field={withNameSpace('financials.0.netbook.value', index)}
                            disabled={editInfo.valuation}
                          />
                        </Row>
                        <Row className="val-row">
                          <Label>Est'd Market Value</Label>
                          <FastCurrencyInput
                            formikProps={formikProps}
                            field={withNameSpace('financials.0.estimated.value', index)}
                            disabled={editInfo.valuation}
                          />
                        </Row>
                        <Row className="val-row">
                          <Label>Assessed Value</Label>
                          <FastCurrencyInput
                            formikProps={formikProps}
                            field={withNameSpace('financials.0.assessed.value', index)}
                            disabled={editInfo.valuation}
                          />
                        </Row>
                        <Row className="val-row">
                          <Label>Appraised Value</Label>
                          <FastCurrencyInput
                            formikProps={formikProps}
                            field={withNameSpace('financials.0.appraised.value', index)}
                            disabled={editInfo.valuation}
                          />
                        </Row>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      ))}
    </Container>
  );
};
