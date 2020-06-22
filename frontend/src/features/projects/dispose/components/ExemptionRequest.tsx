import './ExemptionRequest.scss';

import * as React from 'react';
import { Form } from 'react-bootstrap';
import { Check } from 'components/common/form';
import { TextArea } from 'components/common/form';
import TooltipIcon from 'components/common/TooltipIcon';
import { useFormikContext, getIn } from 'formik';

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
}: IProjectExemptionProps) {
  const { values } = useFormikContext();
  const checked = getIn(values, exemptionField);

  return (
    <React.Fragment>
      <h3>
        {sectionHeader}
        <TooltipIcon toolTipId="exemptionTooltip" toolTip={tooltip} />
      </h3>
      <Form.Row className="ProjectExemptionRequestCheck">
        <Check field={exemptionField} postLabel={exemptionLabel} />
      </Form.Row>
      {checked && (
        <>
          <p>
            <i>{rationaleInstruction ?? 'Provide Rationale'}</i>
          </p>
          <Form.Row className="ProjectExemptionRequestRationale">
            <TextArea
              label={'Rationale'}
              field={rationaleField}
              className="col-md-5"
              outerClassName="col-md-10"
            />
          </Form.Row>
        </>
      )}
    </React.Fragment>
  );
}
