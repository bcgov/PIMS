import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';
import React from 'react';

import * as styled from './styled';

interface IProjectSPLMarketingProps {}

export const ProjectSPLMarketing: React.FC<IProjectSPLMarketingProps> = props => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Marketing</h2>
      <FastDatePicker
        label="Date Entered Market"
        field="marketedOn"
        formikProps={formik}
        size="sm"
      />
    </styled.ProjectSPL>
  );
};
