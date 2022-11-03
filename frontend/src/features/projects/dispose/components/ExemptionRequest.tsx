import './ExemptionRequest.scss';

import { Check } from 'components/common/form';
import { TextArea } from 'components/common/form';
import TooltipIcon from 'components/common/TooltipIcon';
import { getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export interface IProjectExemptionProps {
  /** the label of the ExemptionRequest checkbox */
  exemptionLabel?: string;
  /** the label for the rationale notes */
  rationaleInstruction?: string;
  /** the tooltip to be included with the label */
  tooltip?: string;
  /** the field the exemption boolean is applied to */
  exemptionField: string;
  /** the rationale field the text field will be applied to */
  rationaleField: string;
  /** Header used at the start of the component */
  sectionHeader?: string;
  /** Controls whether or not this component should be interactive */
  isReadOnly?: boolean;
  /** to determine where the component is being called */
  submissionStep?: boolean;
}

/**
 * Component used for requesting an ERP exemption while submitting a project.
 * @param param0
 */
export default function ExemptionRequest({
  exemptionLabel,
  rationaleInstruction,
  tooltip,
  exemptionField,
  rationaleField,
  sectionHeader,
  isReadOnly,
  submissionStep,
}: IProjectExemptionProps) {
  const { values } = useFormikContext();
  const checked = getIn(values, exemptionField);

  return (
    <React.Fragment>
      <Row style={{ alignItems: 'center' }}>
        <Col md="auto">
          <h3>{sectionHeader}</h3>
        </Col>
        <Col md="auto">
          {submissionStep && <TooltipIcon toolTipId="exemptionTooltip" toolTip={tooltip} />}
        </Col>
      </Row>
      {/* only want to display the checkbox for submissions */}
      {submissionStep && (
        <Form.Group className="ProjectExemptionRequestCheck">
          <Check disabled={isReadOnly} field={exemptionField} postLabel={exemptionLabel} />
        </Form.Group>
      )}
      {(checked || !submissionStep) && (
        <>
          <p>
            <i>{rationaleInstruction ?? 'Provide Rationale'}</i>
          </p>
          <Form.Group className="ProjectExemptionRequestRationale">
            <TextArea
              label={'Rationale'}
              field={rationaleField}
              className="col-md-auto"
              outerClassName="col-md-10"
              readOnly={submissionStep ? false : true}
            />
          </Form.Group>
        </>
      )}
    </React.Fragment>
  );
}
