import './AssociatedLandReviewPage.scss';

import { LeasedLandTypes } from 'actions/parcelsActions';
import { useFormStepper } from 'components/common/form/StepForm';
import { AssociatedLandSteps } from 'constants/propertySteps';
import { ParcelDetails } from 'features/mapSideBar/components/tabs/ParcelDetails';
import { UsageValuation } from 'features/mapSideBar/components/tabs/UsageValuation';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange?: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange?: (pin: string) => void;
  isPropertyAdmin?: boolean;
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
            {...{
              withNameSpace,
              editInfo,
              setEditInfo,
              classifications,
              disabled,
              index,
            }}
          />
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
          icon for each section. When you are satisfied that the information provided is correct,
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
