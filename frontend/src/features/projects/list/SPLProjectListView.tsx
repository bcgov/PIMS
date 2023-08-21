import React from 'react';
import { useAppSelector } from 'store';

import { ProjectListView } from '.';

/**
 * A list view paging table to search for projects that have been submitted for assessment.
 * @returns SPLProjectListView component.
 */

interface IProjectFilterState {
  name?: string;
  statusId?: string[];
  agencyId?: string;
  agencies?: number[];
  fiscalYear?: number | '';
  workflowId?: number | '';
}

const initialValues: IProjectFilterState = {
  name: '',
  statusId: ['21', '32', '40', '41', '42', '43'],
  agencyId: '',
  agencies: [],
  fiscalYear: '',
  workflowId: 6, // SPL
};

export const SPLProjectListView = () => {
  const projectStatuses = useAppSelector((store) => store.statuses)?.filter(
    (x) => initialValues?.statusId?.includes(x.id.toString()),
  );
  return (
    <ProjectListView
      filterable={true}
      title="Surplus Property Program Projects - SPL Projects"
      defaultFilter={initialValues}
      statusOptions={projectStatuses}
      showDefaultStatusOptions={false}
    />
  );
};

export default SPLProjectListView;
