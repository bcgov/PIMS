import './AssociatedLandReviewPage.scss';

import { LeasedLandTypes } from 'actions/parcelsActions';
import { FastCurrencyInput, FastInput, FastSelect } from 'components/common/form';
import { useFormStepper } from 'components/common/form/StepForm';
import { LandSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { AssociatedLandSteps } from 'constants/propertySteps';
import { ParcelDetails } from 'features/mapSideBar/components/tabs/ParcelDetails';
import { UsageValuation } from 'features/mapSideBar/components/tabs/UsageValuation';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { getIn, useFormikContext } from 'formik';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { formatFiscalYear } from 'utils';
import { formatMoney } from 'utils/numberFormatUtils';
import { LandSchema } from 'utils/YupSchema';

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
const OtherParcel = () => {
  return (
    <div className="parcel-content" style={{ padding: '40px' }}>
      <p>This parcel is leased externally and will not be added to PIMS.</p>
    </div>
  );
};

/**
 * The Review page that displays all parcels associate to the building.
 * Will display an empty box with a link if an owned parcel has not been completed.
 * Will display an empty box for all non-owned parcels.
 * @param {IReviewProps} props {IReviewProps}
 */
export const AssociatedLandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const { disabled, agencies, nameSpace, classifications } = props;
  const formikProps = useFormikContext<any>();

  const defaultEditValues = {
    identification: true,
    usage: true,
    valuation: true,
  };
  const stepper = useFormStepper();
  const [editInfo, setEditInfo] = useState(defaultEditValues);
  const withNameSpace: Function = useCallback(
    (fieldName: string, index: number) => {
      return nameSpace ? `${nameSpace}.${index}.${fieldName}` : fieldName;
    },
    [nameSpace],
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

    if (
      getIn(formikProps.values.data, `leasedLandMetadata.${index}.type`) === LeasedLandTypes.other
    ) {
      return <OtherParcel />;
    } else if (stepper.getTabCurrentStep(index) !== AssociatedLandSteps.REVIEW) {
      return <EmptyParcel index={index} />;
    } else {
      return (
        <div className="parcel-content">
          <ParcelDetails {...{ withNameSpace, editInfo, setEditInfo, agencies, disabled, index }} />
          <UsageValuation
            {...{ withNameSpace, editInfo, setEditInfo, agencies, disabled, index }}
          />
          <Row>
            <Col md={6}>
              <Row>
                <div className="usage">
                  <Row className="section-header">
                    <span>
                      <LandSvg className="svg" />
                      <h5>Usage</h5>
                    </span>
                    {!disabled && (
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
                      options={classifications}
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
                    {!disabled && (
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
