import './AssociatedLandReviewPage.scss';

import {
  FastInput,
  Input,
  InputGroup,
  FastCurrencyInput,
  Check,
  FastSelect,
  TextArea,
} from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { LandSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import { useFormStepper } from 'components/common/form/StepForm';
import { AssociatedLandSteps } from 'constants/propertySteps';
import { formatMoney } from 'utils/numberFormatUtils';
import { LeasedLandTypes } from 'actions/parcelsActions';
import { formatFiscalYear } from 'utils';
import { ParentSelect } from 'components/common/form/ParentSelect';
import styled from 'styled-components';
import { LandSchema } from 'utils/YupSchema';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
  isPropertyAdmin: boolean;
}

/**
 * Component to be displayed if a parcel exists, but has not been filled out completely.
 * @param param0 index of the parcel on the review form
 */
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

/**
 * Component to display for a parcel that should not be added to PIMS.
 * @param param0 index of the parcel on the review form
 */
const OtherParcel = ({ index }: any) => {
  return (
    <div className="parcel-content" style={{ padding: '40px' }}>
      <p>This parcel is leased externally and will not be added to PIMS.</p>
    </div>
  );
};

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

/**
 * The Review page that displays all parcels associate to the building.
 * Will display an empty box with a link if an owned parcel has not been completed.
 * Will display an empty box for all non-owned parcels.
 * @param {IReviewProps} props {IReviewProps}
 */
export const AssociatedLandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const formikProps = useFormikContext<any>();
  const [privateProject, setPrivateProject] = useState(false);

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

  const getParcelContents = (index: number) => {
    const leasedLandMetadataType = getIn(
      formikProps.values.data,
      `leasedLandMetadata.${index}.type`,
    );
    const isParcelValid =
      leasedLandMetadataType === LeasedLandTypes.other ||
      (leasedLandMetadataType === LeasedLandTypes.owned &&
        LandSchema.isValidSync(getIn(formikProps.values.data, `parcels.${index}`)));
    const parcelEditInfo = {
      identification: editInfo.identification && isParcelValid,
      usage: editInfo.usage && isParcelValid,
      valuation: editInfo.valuation && isParcelValid,
    };
    const currentYear = moment().year();
    const assessedIndex = indexOfFinancial(
      getIn(formikProps.values, withNameSpace('evaluations', index)),
      EvaluationKeys.Assessed,
      currentYear,
    );
    const improvementsIndex = indexOfFinancial(
      getIn(formikProps.values, withNameSpace('evaluations', index)),
      EvaluationKeys.Improvements,
      currentYear,
    );
    const fiscalIndex = indexOfFinancial(
      getIn(formikProps.values, withNameSpace('fiscals', index)),
      FiscalKeys.NetBook,
      currentYear,
    );

    const projectNumbers = getIn(formikProps.values, withNameSpace('projectNumbers', index));
    const agencyId = getIn(formikProps.values, withNameSpace('agencyId', index));

    if (
      getIn(formikProps.values.data, `leasedLandMetadata.${index}.type`) === LeasedLandTypes.other
    ) {
      return <OtherParcel index={index} />;
    } else if (stepper.getTabCurrentStep(index) !== AssociatedLandSteps.REVIEW) {
      return <EmptyParcel index={index} />;
    } else {
      return (
        <div className="parcel-content">
          <Row>
            <Col className="identification">
              <Row>
                <Col md={12}>
                  <Row className="section-header">
                    <span>
                      <LandSvg className="svg" />
                      <h5>Parcel identification</h5>
                    </span>
                    {!props.disabled && (
                      <FaEdit
                        size={20}
                        className="edit"
                        onClick={() =>
                          setEditInfo({
                            ...editInfo,
                            identification: isParcelValid && !parcelEditInfo.identification,
                          })
                        }
                      />
                    )}
                  </Row>
                </Col>
                <Col md={6}>
                  <Row className="content-item">
                    <Label>Agency</Label>
                    <ParentSelect
                      required
                      field={withNameSpace('agencyId', index)}
                      options={props.agencies}
                      filterBy={['code', 'label', 'parent']}
                      disabled={parcelEditInfo.identification || !props.isPropertyAdmin}
                    />
                  </Row>
                  <Row className="content-item">
                    <Label>Land Name</Label>
                    <Input
                      disabled={parcelEditInfo.identification}
                      field={withNameSpace('name', index)}
                    />
                  </Row>
                  <Row className="content-item resizable">
                    <Label>Description</Label>
                    <TextArea
                      fast={true}
                      disabled={parcelEditInfo.identification}
                      field={withNameSpace('description', index)}
                    />
                  </Row>
                  <Row className="content-item resizable">
                    <Label>Legal Description</Label>
                    <TextArea
                      fast={true}
                      disabled={true}
                      field={withNameSpace('landLegalDescription', index)}
                    />
                  </Row>

                  <AddressForm
                    onGeocoderChange={noop}
                    {...formikProps}
                    disabled={true}
                    nameSpace={withNameSpace('address', index)}
                    disableStreetAddress
                  />
                </Col>
                <Col md={6}>
                  <p className="break"></p>
                  <Row className="content-item">
                    <Label>PID/PIN</Label>
                    <Input
                      required={true}
                      displayErrorTooltips
                      className="input-small"
                      disabled={true}
                      field={
                        getIn(formikProps.values, withNameSpace('pid', index))
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
                      disabled={true}
                      type="number"
                      field={withNameSpace('landArea', index)}
                      formikProps={formikProps}
                      postText="Hectares"
                    />
                  </Row>
                  {!!projectNumbers?.length && (
                    <Row style={{ marginTop: '1rem' }}>
                      <Label>Project Number(s)</Label>
                      <StyledProjectNumbers>
                        {projectNumbers.map((projectNum: string) => (
                          <ProjectNumberLink
                            projectNumber={projectNum}
                            key={projectNum}
                            agencyId={agencyId}
                            setPrivateProject={setPrivateProject}
                            privateProject={privateProject}
                          />
                        ))}
                      </StyledProjectNumbers>
                    </Row>
                  )}
                  <br></br>
                  <Row className="harmful">
                    <Label>Harmful info if released?</Label>
                    <Check
                      type="radio"
                      field={withNameSpace('isSensitive', index)}
                      radioLabelOne="Yes"
                      radioLabelTwo="No"
                      disabled={parcelEditInfo.identification}
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
                    {!props.disabled && (
                      <FaEdit
                        size={20}
                        className="edit"
                        onClick={() =>
                          setEditInfo({
                            ...editInfo,
                            usage: isParcelValid && !parcelEditInfo.usage,
                          })
                        }
                      />
                    )}
                  </Row>
                  <Row className="classification field-row">
                    <Label>Classification</Label>
                    <FastSelect
                      formikProps={formikProps}
                      disabled={parcelEditInfo.usage}
                      type="number"
                      placeholder="Must Select One"
                      field={withNameSpace('classificationId', index)}
                      options={props.classifications}
                      required={true}
                    />
                  </Row>
                  <Row className="field-row">
                    <Label>Current Zoning</Label>
                    <FastInput
                      formikProps={formikProps}
                      disabled={parcelEditInfo.usage}
                      field={withNameSpace('zoning', index)}
                    />
                  </Row>
                  <Row className="field-row">
                    <Label>Potential Zoning</Label>
                    <FastInput
                      formikProps={formikProps}
                      disabled={parcelEditInfo.usage}
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
                    {!props.disabled && (
                      <FaEdit
                        size={20}
                        className="edit"
                        onClick={() =>
                          setEditInfo({
                            ...editInfo,
                            valuation: isParcelValid && !parcelEditInfo.valuation,
                          })
                        }
                      />
                    )}
                  </Row>
                  <Row className="val-row">
                    <Label>Net Book Value</Label>
                    <FastCurrencyInput
                      formikProps={formikProps}
                      field={withNameSpace(`fiscals.${fiscalIndex}.value`, index)}
                      disabled={parcelEditInfo.valuation}
                    />
                    <p
                      style={{
                        width: 50,
                        fontSize: 11,
                        textAlign: 'left',
                        fontWeight: 700,
                        color: '#495057',
                      }}
                    >
                      {formatFiscalYear(
                        getIn(
                          formikProps.values,
                          withNameSpace(`fiscals.${fiscalIndex}.fiscalYear`, index),
                        ),
                      )}
                    </p>
                  </Row>
                  <Row className="val-row">
                    <Label>Land value</Label>
                    <FastCurrencyInput
                      formikProps={formikProps}
                      field={withNameSpace(`evaluations.${assessedIndex}.value`, index)}
                      disabled={parcelEditInfo.valuation}
                    />
                    <FastInput
                      formikProps={formikProps}
                      field={withNameSpace(`evaluations.${assessedIndex}.year`, index)}
                      disabled
                      style={{ width: 50, fontSize: 11 }}
                    />
                  </Row>
                  <Row className="val-row">
                    <Label>Building Value</Label>
                    <FastCurrencyInput
                      formikProps={formikProps}
                      field={withNameSpace(`evaluations.${improvementsIndex}.value`, index)}
                      disabled={parcelEditInfo.valuation}
                    />
                    <FastInput
                      formikProps={formikProps}
                      field={withNameSpace(`evaluations.${improvementsIndex}.year`, index)}
                      disabled
                      style={{ width: 50, fontSize: 11 }}
                    />
                  </Row>
                  <Row className="val-row">
                    <Label>Total Assessed Value</Label>
                    <Form.Group>
                      <Form.Control
                        value={formatMoney(
                          (getIn(
                            formikProps.values,
                            withNameSpace(`evaluations.${improvementsIndex}.value`, index),
                          ) || 0) +
                            (getIn(
                              formikProps.values,
                              withNameSpace(`evaluations.${assessedIndex}.value`, index),
                            ) || 0),
                        )}
                        disabled={true}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      );
    }
  };

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
        <Row className="parcel-pane" key={`${tab}.${index}`}>
          <Col>
            <Row className="parcel-header">
              <Col>
                <h4>{formikProps?.values.tabs[index].name}</h4>
                <h4>
                  {index + 1}/{formikProps?.values?.tabs?.length ?? 1}
                </h4>
              </Col>
            </Row>
            {getParcelContents(index)}
          </Col>
        </Row>
      ))}
    </Container>
  );
};
