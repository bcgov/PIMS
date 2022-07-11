import './UpdateInfoForm.scss';

import { Form } from 'components/common/form';
import { IStepProps } from 'features/projects/interfaces';
import React from 'react';

import { IFilterBarState, ProjectNotes, StepErrorSummary } from '../../common';
import { PropertyListViewSelect } from '../components/PropertyListViewSelect';

interface IUpdateInfoFormProps {
  pageIndex: number;
  setPageIndex: Function;
  filter: IFilterBarState;
}

/**
 * Form component of SelectProjectPropertiesStep.
 * @param param0 IUpdateInfoFormProps
 */
const SelectProjectPropertiesForm = ({
  pageIndex,
  setPageIndex,
  filter,
}: IStepProps & IUpdateInfoFormProps) => {
  return (
    <Form>
      <PropertyListViewSelect
        filter={filter}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        field="properties"
      />
      <ProjectNotes className="col-md-auto" />
      <StepErrorSummary />
    </Form>
  );
};

export default SelectProjectPropertiesForm;
