import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

export const ProjectSPLTransferWithinGRE: React.FC = () => {
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
    <styled.ProjectSPL>
      <h2>Transfer within GRE</h2>
      <FastDatePicker
        label="Date Transferred within the GRE"
        field="transferredWithinGreOn"
        formikProps={formik}
        size="sm"
        disabled={disabled}
      />
    </styled.ProjectSPL>
  );
};
