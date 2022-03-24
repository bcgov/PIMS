import React from 'react';
import { ProjectListView } from '.';
import { useAppSelector } from 'store';

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
}

const initialValues: IProjectFilterState = {
  name: '',
  statusId: ['21', '40', '41', '42', '43'],
  agencyId: '',
  agencies: [],
  fiscalYear: '',
};

export const SPLProjectListView = () => {
  const projectStatuses = useAppSelector(store => store.statuses)?.filter(x =>
    initialValues?.statusId?.includes(x.id.toString()),
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
