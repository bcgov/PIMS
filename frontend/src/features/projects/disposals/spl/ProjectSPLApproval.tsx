import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';
import React from 'react';

import * as styled from './styled';

interface IProjectSPLApprovalProps {}

export const ProjectSPLApproval: React.FC<IProjectSPLApprovalProps> = props => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Approval</h2>
      <FastDatePicker
        label="Request for Addition to SPL Received"
        field="requestForSplReceivedOn"
        formikProps={formik}
        size="sm"
      />
      <FastDatePicker
        label="Addition Approved"
        field="approvedForSplOn"
        formikProps={formik}
        size="sm"
      />
    </styled.ProjectSPL>
  );
};
