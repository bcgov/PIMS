import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectSPLTransferWithinGREProps {
  disabled?: boolean;
}

export const ProjectSPLTransferWithinGRE: React.FC<IProjectSPLTransferWithinGREProps> = ({
  disabled = false,
}) => {
  const formik = useFormikContext<IProjectForm>();

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
