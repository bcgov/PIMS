import { Check, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { IProjectForm } from '../interfaces';
import { ProjectNote } from '../notes';
import * as styled from './styled';

export interface IProjectERPExemptionProps {
  disabled?: boolean;
}

export const ProjectERPExemption: React.FC<IProjectERPExemptionProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectERPExemption>
      <h2>Enhanced Referral Process Exemption</h2>
      <Check
        field={`exemptionRequested`}
        postLabel="Apply for Enhanced Referral Process Exemption"
        disabled={disabled}
      />
      <ProjectNote label="Exemption Rationale" field="exemptionRationale" disabled={disabled} />
      <FastDatePicker
        label="ADM Approved Exemption On"
        field="exemptionApprovedOn"
        formikProps={formik}
        size="sm"
        disabled={disabled}
      />
    </styled.ProjectERPExemption>
  );
};
