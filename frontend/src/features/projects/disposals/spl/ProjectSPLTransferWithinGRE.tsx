import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';
import React from 'react';

import * as styled from './styled';

interface IProjectSPLTransferWithinGREProps {}

export const ProjectSPLTransferWithinGRE: React.FC<IProjectSPLTransferWithinGREProps> = props => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Transfer within GRE</h2>
      <FastDatePicker
        label="Date Transferred within the GRE"
        field="transferredWithinGreOn"
        formikProps={formik}
        size="sm"
      />
    </styled.ProjectSPL>
  );
};
