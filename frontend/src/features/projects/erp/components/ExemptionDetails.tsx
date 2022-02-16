import { FastDatePicker, Form } from 'components/common/form';
import { ProjectNotes } from 'features/projects/common';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import React from 'react';

/** ExemptionDetails component properties */
interface IExemptionDetailsProps {
  /** Whether the form inputs will be readonly. */
  isReadOnly?: boolean;
}

/**
 * Provides project exemption form fields.
 * @param param0 Component properties.
 */
export const ExemptionDetails = ({ isReadOnly }: IExemptionDetailsProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <>
      <ProjectNotes
        label="Exemption Rationale"
        field="exemptionRationale"
        disabled={isReadOnly}
        outerClassName="col-md-12"
      />
      <Form.Group>
        <Form.Label column md={4}>
          ADM Approved Exemption On
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="exemptionApprovedOn"
        />
      </Form.Group>
    </>
  );
};
