import { Check, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { IProjectForm } from '../interfaces';
import { ProjectNote } from '../notes';
import * as styled from './styled';

export const ProjectERPExemption: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectERPExemption>
      <h2>Enhanced Referral Process Exemption</h2>
      <Check
        field={`exemptionRequested`}
        postLabel="Apply for Enhanced Referral Process Exemption"
      />
      <ProjectNote label="Exemption Rationale" field="exemptionRationale" />
      <FastDatePicker
        label="ADM Approved Exemption On"
        field="exemptionApprovedOn"
        formikProps={formik}
        size="sm"
      />
    </styled.ProjectERPExemption>
  );
};
