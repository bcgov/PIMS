import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectSPLMarketingProps {
  disabled?: boolean;
}

export const ProjectSPLMarketing: React.FC<IProjectSPLMarketingProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Marketing</h2>
      <FastDatePicker
        label="Date Entered Market"
        field="marketedOn"
        formikProps={formik}
        size="sm"
        disabled={disabled}
      />
    </styled.ProjectSPL>
  );
};
