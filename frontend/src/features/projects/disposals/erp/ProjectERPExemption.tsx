import { Check, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import { ProjectNote } from '../notes';
import * as styled from './styled';

export const ProjectERPExemption: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();

  // Disabled prop
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;
  const keycloak = useKeycloakWrapper();
  const [disabled, setDisabled] = useState(false);
  const isAdmin = keycloak.hasClaim(Claim.ReportsSplAdmin);

  useEffect(() => {
    setDisabled(
      [
        WorkflowStatus.Disposed,
        WorkflowStatus.Cancelled,
        WorkflowStatus.TransferredGRE,
        WorkflowStatus.Denied,
      ].includes(statusCode) && !isAdmin,
    );
  }, [isAdmin, workflowCode, statusCode]);

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
